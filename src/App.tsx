import { useMemo, useState } from "react";
import "./styles.css";
import { eventSpecs, eventTypeNames } from "./data/eventSpecs";
import type { Issue, ResultStatus } from "./types";
import {
  formatJson,
  parseJsonInput,
  validateAgainstSchema,
} from "./utils/validator";

interface ResultState {
  status: ResultStatus;
  title: string;
  subtitle: string;
  selectedType: string;
  issues: Issue[];
  expectedKeys: string[];
  parsedPreview?: string;
}

function getTopLevelKeysForEvent(eventName: string): string[] {
  const schema = eventSpecs[eventName]?.schema;
  return schema?.required ? Object.keys(schema.required) : [];
}

function App() {
  const initialEventType = eventTypeNames[0] ?? "";
  const initialSample = initialEventType
    ? formatJson(eventSpecs[initialEventType].sample)
    : "";

  const [eventType, setEventType] = useState<string>(initialEventType);
  const [jsonInput, setJsonInput] = useState<string>(initialSample);

  const [result, setResult] = useState<ResultState>({
    status: "warn",
    title: "Sample loaded",
    subtitle:
      "You can now validate the sample JSON or edit it to test missing keys and mismatches.",
    selectedType: initialEventType,
    issues: [],
    expectedKeys: getTopLevelKeysForEvent(initialEventType),
  });

  const badgeMap = useMemo(
    () => ({
      success: { icon: "✓", className: "success" },
      error: { icon: "✕", className: "error" },
      warn: { icon: "!", className: "warn" },
    }),
    [],
  );

  function renderResult(
    status: ResultStatus,
    title: string,
    subtitle: string,
    payload: Partial<ResultState> = {},
  ) {
    setResult({
      status,
      title,
      subtitle,
      selectedType: payload.selectedType ?? eventType,
      issues: payload.issues ?? [],
      expectedKeys: payload.expectedKeys ?? getTopLevelKeysForEvent(eventType),
      parsedPreview: payload.parsedPreview,
    });
  }

  function loadSample() {
    const sample = eventSpecs[eventType].sample;
    const formatted = formatJson(sample);
    setJsonInput(formatted);

    renderResult(
      "warn",
      "Sample loaded",
      "You can now validate the sample JSON or edit it to test missing keys and mismatches.",
      {
        selectedType: eventType,
        issues: [],
        expectedKeys: getTopLevelKeysForEvent(eventType),
      },
    );
  }

  function validateCurrentInput() {
    const spec = eventSpecs[eventType];

    if (!jsonInput.trim()) {
      renderResult(
        "error",
        "No JSON found",
        "Please paste a JSON payload before validating.",
        {
          selectedType: eventType,
          issues: [
            {
              path: "root",
              type: "Missing input",
              message: "JSON input is empty",
            },
          ],
        },
      );
      return;
    }

    let parsed: unknown;
    try {
      parsed = parseJsonInput(jsonInput);
    } catch (error) {
      renderResult(
        "error",
        "Invalid JSON format",
        "The input could not be parsed as valid JSON. Please check commas, brackets, or quotes.",
        {
          selectedType: eventType,
          issues: [
            {
              path: "root",
              type: "Parse error",
              message:
                error instanceof Error ? error.message : "Unknown parse error",
            },
          ],
        },
      );
      return;
    }

    const issues = validateAgainstSchema(parsed, spec.schema);

    if (issues.length === 0) {
      renderResult(
        "success",
        "Valid JSON structure",
        "The payload matches the expected structure for the selected event type.",
        {
          selectedType: eventType,
          issues,
          parsedPreview: formatJson(parsed),
        },
      );
    } else {
      renderResult(
        "error",
        "Structure mismatch found",
        "The payload is missing required keys or contains invalid values/types for this event.",
        {
          selectedType: eventType,
          issues,
          parsedPreview: formatJson(parsed),
        },
      );
    }
  }

  function clearInput() {
    setJsonInput("");
    renderResult(
      "warn",
      "Cleared",
      "Input has been cleared. Paste another JSON payload to validate.",
      {
        selectedType: eventType,
        issues: [],
      },
    );
  }

  function formatCurrentJson() {
    try {
      const parsed = parseJsonInput(jsonInput);
      const formatted = formatJson(parsed);
      setJsonInput(formatted);

      renderResult(
        "warn",
        "JSON formatted",
        "The JSON was formatted successfully. You can validate it now.",
        {
          selectedType: eventType,
          parsedPreview: formatted,
        },
      );
    } catch (error) {
      renderResult(
        "error",
        "Could not format JSON",
        "The input is not valid JSON yet.",
        {
          selectedType: eventType,
          issues: [
            {
              path: "root",
              type: "Parse error",
              message:
                error instanceof Error ? error.message : "Unknown parse error",
            },
          ],
        },
      );
    }
  }

  function handleEventChange(value: string) {
    setEventType(value);

    setResult({
      status: "warn",
      title: "Event changed",
      subtitle: `Now validating against: ${value}`,
      selectedType: value,
      issues: [],
      expectedKeys: getTopLevelKeysForEvent(value),
    });
  }

  const badge = badgeMap[result.status];

  return (
    <div className="container">
      <div className="header">
        <h1>JSON Event Validator</h1>
        <p>
          Select an event type, paste the JSON, and validate whether the payload
          matches the expected key structure. The page checks required fields,
          nested hierarchy, array/object types, and fixed values where needed.
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-body">
            <label htmlFor="eventType">Event Type</label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => handleEventChange(e.target.value)}
            >
              {eventTypeNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <div className="actions">
              <button className="btn-secondary" onClick={loadSample}>
                Load Sample JSON
              </button>
              <button className="btn-light" onClick={clearInput}>
                Clear
              </button>
            </div>

            <div className="panel">
              <h3>What this validates</h3>
              <ul className="help-list">
                <li>Required top-level and nested keys</li>
                <li>Hierarchical object and array structure</li>
                <li>Expected data types like string, number, object, array</li>
                <li>
                  Fixed values such as <code>action</code>, <code>name</code>
                </li>
                <li>Minimum required array items</li>
              </ul>
            </div>

            <div className="panel">
              <h3>Notes</h3>
              <p className="muted">
                Extra keys are allowed. The validator focuses on required
                structure.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <label htmlFor="jsonInput">JSON Input</label>
            <textarea
              id="jsonInput"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste JSON here..."
            />

            <div className="actions">
              <button className="btn-primary" onClick={validateCurrentInput}>
                Submit & Validate
              </button>
              <button className="btn-light" onClick={formatCurrentJson}>
                Format JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card result-card">
        <div className="card-body">
          <div className="result-head">
            <div className={`badge ${badge.className}`}>{badge.icon}</div>
            <div>
              <p className="status-title">{result.title}</p>
              <p className="status-subtitle">{result.subtitle}</p>
            </div>
          </div>

          <div className="two-col">
            <div className="metric">
              <div className="label">Selected Event</div>
              <div className="value value-small">
                {result.selectedType || "-"}
              </div>
            </div>

            <div className="metric">
              <div className="label">Issues Found</div>
              <div className="value">{result.issues.length}</div>
            </div>
          </div>

          <div className="panel">
            <h3>Expected required top-level keys</h3>
            <div className="chips">
              {result.expectedKeys.length ? (
                result.expectedKeys.map((key) => (
                  <span key={key} className="chip">
                    {key}
                  </span>
                ))
              ) : (
                <span className="muted">No keys available</span>
              )}
            </div>
          </div>

          {result.issues.length ? (
            <div className="panel">
              <h3>Missing / invalid fields</h3>
              <div className="issues">
                {result.issues.map((issue, idx) => (
                  <div className="issue" key={idx}>
                    <strong>{issue.type}</strong>
                    <div>
                      <code>{issue.path}</code>
                    </div>
                    <div className="muted">{issue.message}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="panel">
              <h3>Validation summary</h3>
              <p className="muted">
                All required keys and nested structures were found in the
                expected format.
              </p>
            </div>
          )}

          {result.parsedPreview && (
            <div className="panel">
              <h3>Formatted JSON Preview</h3>
              <pre>{result.parsedPreview}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
