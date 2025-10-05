// components/AdminFormDetails.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import type { Form } from "../types/models";

export default function AdminFormDetails() {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState("");

  const { formId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, [formId]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const res = await api.get<Form>(`/forms/${formId}/`);
      setForm(res.data);
    } catch (err) {
      console.error("Error fetching form:", err);
      alert("Form not found");
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const addField = async () => {
    if (!label) return alert("Label is required");
    if (!formId) return;

    try {
      await api.post("/fields/", {
        form: parseInt(formId),
        label,
        field_type: fieldType,
        required,
        options:
          fieldType === "dropdown" || fieldType === "checkbox"
            ? options.split(",").map((o) => o.trim())
            : null,
      });
      
      setLabel("");
      setOptions("");
      setRequired(false);
      setFieldType("text");
      await fetchForm();
    } catch (err) {
      console.error("Error adding field:", err);
      alert("Failed to add field");
    }
  };

  const handlePreview = () => {
    if (formId) {
      window.open(`/forms/${formId}`, '_blank');
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (loading) return (
    <div className="loading-state">
      <p>Loading form details...</p>
    </div>
  );
  
  if (!form) return (
    <div className="error-state">
      <p>Form not found</p>
      <button onClick={handleBack} className="back-button">
        ← Back to Forms
      </button>
    </div>
  );

  return (
    <div className="admin-form-details">
      <div className="form-details-header">
        <button onClick={handleBack} className="back-button">
          ← Back
        </button>
        <div className="header-actions">
          <button onClick={handlePreview} className="preview-button">
            👁️ Preview Form
          </button>
        </div>
      </div>

      <h2 className="form-title">Editing: {form.name}</h2>

      <div className="add-field-section">
        <h3>Add New Field</h3>
        <div className="field-form">
          <input
            type="text"
            placeholder="Field Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="field-input"
          />
          <select
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
            className="field-select"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="dropdown">Dropdown</option>
            <option value="checkbox">Checkbox</option>
            <option value="file">File</option>
          </select>
          <label className="required-checkbox">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
            Required
          </label>
          {(fieldType === "dropdown" || fieldType === "checkbox") && (
            <input
              type="text"
              placeholder="Options (comma-separated)"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              className="options-input"
            />
          )}
          <button onClick={addField} className="add-field-button">
            ➕ Add Field
          </button>
        </div>
      </div>

      <div className="existing-fields">
        <h3>Form Fields ({form.fields ? form.fields.length : 0})</h3>

        {form.fields && form.fields.length > 0 ? (
          <div className="fields-list">
            {form.fields.map((field) => (
              <div key={field.id} className="field-item">
                <div className="field-header">
                  <strong>{field.label}</strong>
                  <span className="field-type">{field.field_type}</span>
                  <span className={`required-badge ${field.required ? 'required' : 'optional'}`}>
                    {field.required ? "Required" : "Optional"}
                  </span>
                </div>
                {field.options && field.options.length > 0 && (
                  <div className="field-options">
                    Options: {field.options.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-fields">
            <p>⚠️ No fields added yet. Start by adding your first field above.</p>
          </div>
        )}
      </div>
    </div>
  );
}