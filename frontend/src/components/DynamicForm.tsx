// components/DynamicForm.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import type { Form } from "../types/models";

// Remove the formId prop since we'll get it from URL params
export default function DynamicForm() {
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submittedBy, setSubmittedBy] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { formId } = useParams();

  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, [formId]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<Form>(`/forms/${formId}/`);
      setForm(res.data);
    } catch (err) {
      setError("Form not found or failed to load");
      console.error("Error fetching form:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formId) return;
    
    try {
      // Submit using the unified field-responses API on the backend
      const payload = {
        form_id: parseInt(formId),
        submitted_by: submittedBy,
        answers: answers,
      };
      await api.post("/field-responses/", payload);
      alert("✅ Form submitted successfully!");
      setAnswers({}); // Clear form after submission
      setSubmittedBy("");
    } catch (err) {
      alert("❌ Failed to submit form. Please try again.");
      console.error("Submission error:", err);
    }
  };

  const handleClear = () => {
    setAnswers({});
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="google-form-card">
          <div className="google-form-loading">Loading form...</div>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="google-form-card">
          <div className="form-error">
            <h3>Form Not Available</h3>
            <p>{error || "The form you're looking for doesn't exist."}</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="google-form-button"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="google-form-card">
        <div className="google-form-section">
          <h2 className="google-form-section-title">{form.name}</h2>
          <p className="google-form-section-description">
            {form.description || "Please fill out the form below"}
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Optional submitter info */}
          <div className="form-group">
            <label className="form-label">Your Name or Email (optional)</label>
            <input
              type="text"
              className="google-form-input"
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
              placeholder="Enter your name or email"
            />
          </div>

          {form.fields.map((field) => (
            <div key={field.id} className="form-group">
              <label
                className={`form-label ${
                  field.required ? "required-field" : ""
                }`}
              >
                {field.label}
              </label>

              {field.field_type === "text" && (
                <input
                  type="text"
                  className="google-form-input"
                  value={answers[field.label] || ""}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  placeholder={`Enter ${field.label}`}
                  required={field.required}
                />
              )}

              {field.field_type === "number" && (
                <input
                  type="number"
                  className="google-form-input"
                  value={answers[field.label] || ""}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  placeholder={`Enter ${field.label}`}
                  required={field.required}
                />
              )}

              {field.field_type === "date" && (
                <input
                  type="date"
                  className="google-form-input"
                  value={answers[field.label] || ""}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  required={field.required}
                />
              )}

              {field.field_type === "dropdown" && (
                <select
                  className="google-form-select"
                  value={answers[field.label] || ""}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.field_type === "checkbox" && (
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id={`chk-${field.id}`}
                    checked={answers[field.label] || false}
                    onChange={(e) => handleChange(field.label, e.target.checked)}
                  />
                  <label htmlFor={`chk-${field.id}`}>{field.label}</label>
                </div>
              )}
            </div>
          ))}

          <div className="mt-6 flex gap-4">
            <button
              type="button"
              className="google-form-button"
              onClick={handleSubmit}
            >
              Submit
            </button>

            <button
              type="button"
              className="google-form-button google-form-button-secondary"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}