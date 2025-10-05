// components/AdminSubmissions.tsx
import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import type { Form } from "../types/models";

interface FieldResponseItem {
  id: number;
  field: {
    id: number;
    label: string;
    field_type: string;
    required: boolean;
    options?: any;
    validation_type?: string;
    order?: number;
  };
  formatted_value: any;
  files: { id: number; filename: string }[];
}

interface SubmissionListItem {
  submission_id: number;
  form_id: number;
  form_name: string;
  submitted_by: string | null;
  status: string;
  submitted_at: string;
  created_at: string;
  answers: Record<string, any>;
  field_responses: FieldResponseItem[];
}

export default function AdminSubmissions() {
  const [forms, setForms] = useState<Form[]>([]);
  const [formId, setFormId] = useState<number | "">("");
  const [items, setItems] = useState<SubmissionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    // load forms for filter
    (async () => {
      try {
        const res = await api.get<Form[]>("/forms/");
        setForms(res.data);
      } catch (err) {
        console.error("Failed to load forms", err);
      }
    })();
  }, []);

  useEffect(() => {
    fetchSubmissions(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, status]);

  const fetchSubmissions = async (targetPage: number) => {
    try {
      setLoading(true);
      const params: any = { page: targetPage, page_size: 20 };
      if (formId) params.form_id = formId;
      if (status) params.status = status;
      const res = await api.get("/field-responses/", { params });
      setItems(res.data.results || []);
      setPage(res.data.page || targetPage);
      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      console.error("Failed to load submissions", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFormId("");
    setStatus("");
    fetchSubmissions(1);
  };

  const statusOptions = useMemo(() => [
    { value: "", label: "All statuses" },
    { value: "submitted", label: "Submitted" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ], []);

  return (
    <div className="content">
      <div className="forms-list-header">
        <h3>Submissions</h3>
      </div>

      {/* Filters */}
      <div className="create-form-inputs" style={{ marginBottom: 16 }}>
        <select
          className="field-select"
          value={formId}
          onChange={(e) => setFormId(e.target.value ? parseInt(e.target.value) : "")}
        >
          <option value="">All Forms</option>
          {forms.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <select
          className="field-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button className="refresh-button" onClick={() => fetchSubmissions(1)}>🔄 Refresh</button>
        <button className="back-button" onClick={clearFilters}>Clear</button>
      </div>

      {/* List */}
      {loading ? (
        <div className="loading-state"><p>Loading submissions...</p></div>
      ) : (
        <div className="fields-list">
          {items.map((it) => (
            <div key={it.submission_id} className="field-item">
              <div className="field-header" style={{ justifyContent: "space-between" }}>
                <div>
                  <strong>Submission #{it.submission_id}</strong>
                  <span className="field-type" style={{ marginLeft: 8 }}>{it.form_name}</span>
                  <span className="required-badge" style={{ marginLeft: 8 }}>{it.status}</span>
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {new Date(it.submitted_at || it.created_at).toLocaleString()}
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 13, color: "#333" }}>Submitted by: {it.submitted_by || "Anonymous"}</div>
              </div>
              {it.field_responses && it.field_responses.length > 0 ? (
                <div style={{ marginTop: 10 }}>
                  <h4 style={{ margin: "8px 0" }}>Field Responses</h4>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {it.field_responses.map((fr) => (
                      <li key={fr.id} style={{ padding: "6px 0", borderBottom: "1px dashed #ddd" }}>
                        <div style={{ fontWeight: 600 }}>{fr.field.label} <span style={{ fontWeight: 400, color: '#6b7280' }}>({fr.field.field_type})</span></div>
                        <div style={{ marginTop: 2 }}>Answer: {String(fr.formatted_value)}</div>
                        {fr.files && fr.files.length > 0 && (
                          <div style={{ marginTop: 2 }}>Files: {fr.files.map(f => f.filename).join(", ")}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div style={{ marginTop: 10, color: '#6b7280' }}>No field responses recorded.</div>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <div className="no-forms">
              <div className="no-forms-icon">📄</div>
              <h4>No submissions found</h4>
              <p>Try changing filters or check back later.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button className="back-button" disabled={page <= 1} onClick={() => fetchSubmissions(page - 1)}>Prev</button>
        <div style={{ lineHeight: "32px" }}>Page {page} / {totalPages}</div>
        <button className="back-button" disabled={page >= totalPages} onClick={() => fetchSubmissions(page + 1)}>Next</button>
      </div>
    </div>
  );
}