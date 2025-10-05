// components/AdminForms.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import type { Form } from "../types/models";
import Notifications from "./Notifications";

export default function AdminForms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { formId } = useParams();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      console.log("Fetching forms...");
      const res = await api.get<Form[]>("/forms/");
      console.log("Forms response:", res.data);
      setForms(res.data);
    } catch (err) {
      console.error("Error fetching forms:", err);
      setError("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  const createForm = async () => {
    if (!name.trim()) return alert("Please enter a form name");
    
    try {
      console.log("Creating form:", name);
      await api.post("/forms/", { 
        name: name.trim(), 
        description: "" 
      });
      setName("");
      await fetchForms(); // Refresh the list
      alert("Form created successfully!");
    } catch (err) {
      console.error("Error creating form:", err);
      alert("Failed to create form");
    }
  };

  const handleSelectForm = (formId: number) => {
    navigate(`/admin/forms/${formId}`);
  };

  const handlePreviewForm = (formId: number) => {
    window.open(`/forms/${formId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="admin-forms-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading forms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-forms-container">
        <div className="error-state">
          <h3>Error Loading Forms</h3>
          <p>{error}</p>
          <button onClick={fetchForms} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-forms-container">
      <Notifications />
      
      {/* Create Form Section - Make sure this is visible */}
      <div className="create-form-section">
        <h3>Create New Form</h3>
        <div className="create-form-inputs">
          <input
            type="text"
            placeholder="Enter form name (e.g., KYC Form, Loan Application)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            onKeyPress={(e) => e.key === 'Enter' && createForm()}
          />
          <button 
            onClick={createForm} 
            className="create-form-button"
            disabled={!name.trim()}
          >
            + Create Form
          </button>
        </div>
        <p className="create-form-hint">
          After creating a form, click "Edit Form" to add fields and questions.
        </p>
      </div>

      {/* Forms List */}
      <div className="forms-list">
        <div className="forms-list-header">
          <h3>Your Forms ({forms.length})</h3>
          {forms.length > 0 && (
            <button onClick={fetchForms} className="refresh-button">
              🔄 Refresh
            </button>
          )}
        </div>
        
        {formId && (
          <div className="current-form-actions">
            <button onClick={() => navigate('/admin')} className="back-button">
              ← Back to All Forms
            </button>
          </div>
        )}

        <div className="forms-grid">
          {forms.map((form) => (
            <div 
              key={form.id} 
              className={`form-card ${parseInt(formId || '0') === form.id ? 'active' : ''}`}
            >
              <div className="form-card-content">
                <h4 className="form-name">{form.name}</h4>
                <p className="form-meta">
                  {form.fields?.length || 0} fields • 
                  Created: {new Date().toLocaleDateString()}
                </p>
                <div className="form-stats">
                  <span className="stat">
                    📝 {form.fields?.length || 0} questions
                  </span>
                  <span className="stat">
                    {form.fields?.some(f => f.required) ? '🔴' : '🔵'} {form.fields?.filter(f => f.required).length || 0} required
                  </span>
                </div>
              </div>
              <div className="form-actions">
                <button 
                  onClick={() => handleSelectForm(form.id)}
                  className={`edit-button ${parseInt(formId || '0') === form.id ? 'editing' : ''}`}
                >
                  {parseInt(formId || '0') === form.id ? 'Currently Editing' : 'Edit Form'}
                </button>
                <button 
                  onClick={() => handlePreviewForm(form.id)}
                  className="preview-button"
                >
                  👁️ Preview
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {forms.length === 0 && (
          <div className="no-forms">
            <div className="no-forms-icon">📄</div>
            <h4>No forms created yet</h4>
            <p>Create your first form using the form above!</p>
            <div className="no-forms-tips">
              <p><strong>Tip:</strong> Forms you create will appear here</p>
              <p><strong>Tip:</strong> Click "Edit Form" to add fields and questions</p>
              <p><strong>Example forms:</strong> KYC Form, Loan Application, Investment Declaration</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}