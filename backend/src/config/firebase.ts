import { initializeApp, cert, getApps } from "firebase-admin/app";
import { readFileSync } from "fs";
import path from "path";

const serviceAccount = JSON.parse(
  readFileSync(
    path.join(process.cwd(), "firebase-service-account.json"),
    "utf8"
  )
);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}