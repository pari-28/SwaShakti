import { useState } from "react";
import { submitCommunityReport } from "../services/communityReport";

const CATEGORIES = [
  "Harassment",
  "Stalking",
  "Unsafe Area",
  "Theft",
  "Assault",
  "Verbal Abuse",
  "Suspicious Activity",
  "Other",
];

interface CommunityReportFormProps {
  onReportSubmitted?: () => void | Promise<void>;
}

export default function CommunityReportForm({
  onReportSubmitted,
}: CommunityReportFormProps) {

const [category, setCategory] = useState("");
const [description, setDescription] = useState("");
const [occurredAt, setOccurredAt] = useState("");

const [locationText, setLocationText] = useState("");
const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

const [submitting, setSubmitting] = useState(false);

const [message, setMessage] = useState<string | null>(null);

const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setMessage(null);
  setError(null);

  if (!category) {
    setError("Please select an incident category.");
    return;
  }

  if (!description.trim()) {
    setError("Please describe the incident.");
    return;
  }

  if (!locationText.trim()) {
    setError("Please enter the approximate incident location.");
    return;
  }

  try {
    setSubmitting(true);

    await submitCommunityReport({
  category,
  description: description.trim(),
  location: locationText.trim(),
  locationPrecision: "APPROXIMATE",
  occurredAt: occurredAt
    ? new Date(occurredAt).toISOString()
    : undefined,
  evidence: evidenceFile,
});

setMessage("Incident report submitted successfully.");

// Refresh the evidence list in the dashboard
await onReportSubmitted?.();

    setCategory("");
    setDescription("");
    setOccurredAt("");
    setLocationText("");
    setEvidenceFile(null);
  } catch (err) {
    console.error("Community report submission failed:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Failed to submit incident report."
    );
  } finally {
    setSubmitting(false);
  }
};
  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Report an Incident
        </h2>

        <p
          style={{
            marginTop: "6px",
            marginBottom: 0,
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          Help improve community safety by reporting an incident.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Category */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 700,
              color: "#334155",
              marginBottom: "7px",
            }}
          >
            Incident Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 12px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              background: "white",
            }}
          >
            <option value="">Select category</option>

            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 700,
              color: "#334155",
              marginBottom: "7px",
            }}
          >
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened..."
            rows={5}
            style={{
              width: "100%",
              padding: "11px 12px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Incident time */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 700,
              color: "#334155",
              marginBottom: "7px",
            }}
          >
            Approximate Incident Time
          </label>

          <input
            type="datetime-local"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 12px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Evidence Upload */}
<div style={{ marginBottom: "16px" }}>
  <label
    style={{
      display: "block",
      fontSize: "13px",
      fontWeight: 700,
      color: "#334155",
      marginBottom: "7px",
    }}
  >
    Evidence <span style={{ color: "#94a3b8" }}>(Optional)</span>
  </label>

  <input
    type="file"
    accept="image/*,video/*,audio/*"
    onChange={(e) => {
      setEvidenceFile(e.target.files?.[0] || null);
    }}
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      fontSize: "13px",
      background: "white",
      boxSizing: "border-box",
    }}
  />

  <p
    style={{
      marginTop: "6px",
      marginBottom: 0,
      fontSize: "11px",
      color: "#64748b",
    }}
  >
    Optionally upload a photo, video, or audio file related to the incident.
  </p>

  {evidenceFile && (
    <div
      style={{
        marginTop: "8px",
        padding: "8px 10px",
        borderRadius: "8px",
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        color: "#166534",
        fontSize: "12px",
      }}
    >
      Selected: {evidenceFile.name}
    </div>
  )}
</div>

        {/* Manual Incident Location */}
<div style={{ marginBottom: "18px" }}>
  <label
    style={{
      display: "block",
      fontSize: "13px",
      fontWeight: 700,
      color: "#334155",
      marginBottom: "7px",
    }}
  >
    Approximate Incident Location
  </label>

  <input
    type="text"
    value={locationText}
    onChange={(e) => setLocationText(e.target.value)}
    placeholder="e.g. MP Nagar, Bhopal"
    style={{
      width: "100%",
      padding: "11px 12px",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      fontSize: "14px",
      boxSizing: "border-box",
    }}
  />

  <p
    style={{
      marginTop: "6px",
      marginBottom: 0,
      fontSize: "11px",
      color: "#64748b",
    }}
  >
    Enter the area or landmark where the incident occurred. Exact address is
    not required.
  </p>
</div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: "14px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div
            style={{
              marginBottom: "14px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#047857",
              fontSize: "13px",
            }}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: submitting ? "#94a3b8" : "#6c3eff",
            color: "white",
            fontSize: "14px",
            fontWeight: 800,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit Incident Report"}
        </button>
      </form>
    </div>
  );
}