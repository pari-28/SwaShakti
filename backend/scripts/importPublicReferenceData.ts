import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import prisma from "../src/config/prisma.js";

const CSV_PATH = path.resolve(
  process.cwd(),
  "../data/public-reference/crime_dataset_india.csv"
);

const startRow = Number(process.argv[2] ?? 1);
const endRow = Number(process.argv[3] ?? 5000);

if (
  !Number.isInteger(startRow) ||
  !Number.isInteger(endRow) ||
  startRow < 1 ||
  endRow < startRow
) {
  throw new Error(
    "Usage: npx tsx scripts/importPublicReferenceData.ts <startRow> <endRow>"
  );
}

type CsvRow = {
  "Report Number": string;
  "Date Reported": string;
  "Date of Occurrence": string;
  "Time of Occurrence": string;
  City: string;
  "Crime Code": string;
  "Crime Description": string;
  "Victim Age": string;
  "Victim Gender": string;
  "Weapon Used": string;
  "Crime Domain": string;
  "Police Deployed": string;
  "Case Closed": string;
  "Date Case Closed": string;
};

function parseDateTime(value?: string): Date | null {
  if (!value?.trim()) return null;

  const parts = value.trim().split(/\s+/);
  const datePart = parts[0];
  const timePart = parts[1] ?? "00:00";

  const [day, month, year] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  if (
    !day ||
    !month ||
    !year ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null;
  }

  const date = new Date(year, month - 1, day, hours, minutes);

  return Number.isNaN(date.getTime()) ? null : date;
}

function parseOccurredAt(row: CsvRow): Date | null {
  return (
    parseDateTime(row["Time of Occurrence"]) ??
    parseDateTime(row["Date of Occurrence"])
  );
}

function parseInteger(value?: string): number | null {
  if (!value?.trim()) return null;

  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseBoolean(value?: string): boolean | null {
  if (!value?.trim()) return null;

  const normalized = value.trim().toLowerCase();

  if (normalized === "yes") return true;
  if (normalized === "no") return false;

  return null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message : String(error);

  return (
    message.includes("EHOSTUNREACH") ||
    message.includes("ECONNRESET") ||
    message.includes("ETIMEDOUT") ||
    message.includes("ECONNREFUSED") ||
    message.includes("Connection terminated") ||
    message.includes("connection")
  );
}

async function upsertWithRetry(row: CsvRow) {
  const sourceRecordId = row["Report Number"]?.trim();

  if (!sourceRecordId) {
    throw new Error("Missing Report Number");
  }

  const occurredAt = parseOccurredAt(row);
  const reportedAt = parseDateTime(row["Date Reported"]);
  const caseClosedAt = parseDateTime(row["Date Case Closed"]);

  const data = {
    category:
      row["Crime Description"]?.trim() || "UNKNOWN",

    crimeCode:
      row["Crime Code"]?.trim() || null,

    crimeDomain:
      row["Crime Domain"]?.trim() || null,

    occurredAt,
    reportedAt,

    city:
      row.City?.trim() || null,

    latitude: null,
    longitude: null,

    locationPrecision: "CITY",

    victimAge: parseInteger(row["Victim Age"]),

    victimGender:
      row["Victim Gender"]?.trim() || null,

    weaponUsed:
      row["Weapon Used"]?.trim() || null,

    caseClosed: parseBoolean(row["Case Closed"]),
    caseClosedAt,

    metadata: {
      policeDeployed: parseInteger(row["Police Deployed"]),
      originalDateOfOccurrence:
        row["Date of Occurrence"]?.trim() || null,
    },
  };

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      return await prisma.publicReferenceIncident.upsert({
        where: {
          source_sourceRecordId: {
            source: "PUBLIC_REFERENCE_DATA",
            sourceRecordId,
          },
        },

        update: data,

        create: {
          source: "PUBLIC_REFERENCE_DATA",
          sourceRecordId,
          ...data,
        },
      });
    } catch (error) {
      if (!isRetryableError(error) || attempt === 5) {
        throw error;
      }

      console.log(
        `Connection problem. Retrying ${attempt}/5...`
      );

      await sleep(2000 * attempt);
    }
  }
}

async function main() {
  console.log("==========================================");
  console.log("SwaShakti Public Reference Data Import");
  console.log("==========================================");

  console.log(`CSV: ${CSV_PATH}`);
  console.log(`CSV data rows: ${startRow} → ${endRow}`);
  console.log("");

  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`CSV file not found: ${CSV_PATH}`);
  }

  let csvDataRowNumber = 0;
  let processed = 0;
  let skipped = 0;

  await new Promise<void>((resolve, reject) => {
    const stream = fs
      .createReadStream(CSV_PATH)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
        })
      );

    stream.on("data", async (row: CsvRow) => {
      stream.pause();

      try {
        csvDataRowNumber++;

        if (
          csvDataRowNumber < startRow ||
          csvDataRowNumber > endRow
        ) {
          stream.resume();
          return;
        }

        if (!row["Report Number"]?.trim()) {
          skipped++;
          stream.resume();
          return;
        }

        await upsertWithRetry(row);

        processed++;

        if (processed % 250 === 0) {
          console.log(
            `Processed ${processed} rows in this chunk...`
          );
        }

        if (csvDataRowNumber >= endRow) {
          stream.destroy();
          resolve();
          return;
        }

        stream.resume();
      } catch (error) {
        reject(error);
      }
    });

    stream.on("end", () => resolve());
    stream.on("error", reject);
  });

  console.log("");
  console.log("==========================================");
  console.log("Chunk completed");
  console.log("==========================================");
  console.log(`CSV range: ${startRow} → ${endRow}`);
  console.log(`Processed: ${processed}`);
  console.log(`Skipped:   ${skipped}`);
}

main()
  .catch((error) => {
    console.error("");
    console.error("Import failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });