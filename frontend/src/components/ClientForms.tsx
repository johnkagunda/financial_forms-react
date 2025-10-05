// components/ClientForms.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import type { Form } from "../types/models";

export default function ClientForms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await api.get<Form[]>("/forms/");
      setForms(res.data);
    } catch (err) {
      console.error("Error fetching forms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectForm = (formId: number) => {
    navigate(`/forms/${formId}`);
  };

  if (loading) {
    return (
      <div className="client-forms-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading available forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="client-forms-container">
      <div className="client-forms-header">
        <h1 className="client-forms-title">Available Onboarding Forms</h1>
        <p className="client-forms-subtitle">
          Please select a form to begin your onboarding process
        </p>
      </div>

      <div className="forms-grid">
        {forms.map((form) => (
          <div key={form.id} className="form-card-client">
            <div className="form-card-header">
              <h3 className="form-name">{form.name}</h3>
              {form.description && (
                <p className="form-description">{form.description}</p>
              )}
            </div>
            
            <div className="form-stats">
              <div className="stat-item">
                <span className="stat-icon">📝</span>
                <span className="stat-text">{form.fields?.length || 0} questions</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⏱️</span>
                <span className="stat-text">~{Math.ceil((form.fields?.length || 0) * 0.5)} min</span>
              </div>
            </div>

            <div className="form-card-actions">
              <button
                onClick={() => handleSelectForm(form.id)}
                className="start-form-button"
              >
                Start Form
              </button>
            </div>
          </div>
        ))}
      </div>

      {forms.length === 0 && (
        <div className="no-forms-client">
          <div className="no-forms-icon">📄</div>
          <h3>No Forms Available</h3>
          <p>There are no forms available to fill out at the moment.</p>
          <p className="no-forms-contact">
            Please contact the administrator or check back later.
          </p>
        </div>
      )}
    </div>
  );
}