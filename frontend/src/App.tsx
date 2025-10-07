// App.tsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import AdminForms from "./components/AdminForms";
import AdminFormDetails from "./components/AdminFormDetails";
import DynamicForm from "./components/DynamicForm";
import ClientForms from "./components/ClientForms";
import AdminSubmissions from "./components/AdminSubmissions";
import Notifications from "./components/Notifications";
import "./styles/theme.css";

function App() {
  const [mode, setMode] = useState<"admin" | "client">("admin");
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  return (
    <Router>
      <div className="app">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            {/* Logo & Brand */}
            <div className="logo-section">
              <div className="logo">
                <span className="logo-text">AF</span>
              </div>
              <div>
                <h1 className="title">ACTSERV Financial Onboarding</h1>
                <p className="subtitle">Secure Client Onboarding Platform</p>
              </div>
            </div>

            {/* Navigation & Mode Toggle */}
            <div className="nav-controls" style={{ position: 'relative' }}>
              {mode === "admin" && (
                <nav className="admin-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a href="/admin" className="nav-link">Forms Builder</a>
                  <a href="/admin/submissions" className="nav-link">Submissions</a>
                  <button 
                    className="notifications-button"
                    onClick={() => setShowNotifications((v) => !v)}
                    aria-label="Toggle notifications"
                  >
                     Notifications
                  </button>
                  {showNotifications && (
                    <div style={{ position: 'absolute', right: 0, top: '48px', zIndex: 99 }}>
                      <Notifications />
                    </div>
                  )}
                </nav>
              )}
              
              <div className="toggle-container">
                <button
                  onClick={() => {
                    setMode("admin");
                    window.location.href = '/admin';
                  }}
                  className={`toggle-button ${mode === "admin" ? "active" : ""}`}
                >
                  <span className="toggle-icon">⚙️</span>
                  Admin Portal
                </button>
                <button
                  onClick={() => {
                    setMode("client");
                    window.location.href = '/client';
                  }}
                  className={`toggle-button ${mode === "client" ? "active" : ""}`}
                >
                  <span className="toggle-icon"></span>
                  Client Portal
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />} />
            <Route path="/admin/forms/:formId" element={<AdminLayout />} />
<Route path="/admin/submissions" element={<AdminSubmissions />} />
            
            {/* Client Routes */}
            <Route path="/client" element={<ClientFormsLayout />} />
            <Route path="/forms/:formId" element={<ClientFormWrapper />} />
            
            {/* Redirects */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <p className="footer-text">
                <span className="footer-brand">ACTSERV Financial Services</span> •
                Dynamic Onboarding Platform v2.0
              </p>
              <p className="footer-subtext">
                 SOC 2 Compliant • Real-time Analytics •  Scalable Architecture
              </p>
            </div>
            <div className="footer-links">
              <span>Forms: {mode === 'admin' ? 'Builder Mode' : 'Client Mode'}</span>
              <span>|</span>
              <a href="/privacy">Privacy</a>
              <span>|</span>
              <a href="/support">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Admin Layout Component - FIXED
const AdminLayout = () => {
  const { formId } = useParams();
  
  return (
    <div className="admin-layout">
      {/* Forms Sidebar */}
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div>
              <h2 className="sidebar-title">Forms Management</h2>
              <p className="sidebar-subtitle">Create & configure onboarding forms</p>
            </div>
            <span className={`status-badge ${formId ? 'editing' : 'viewing'}`}>
              {formId ? " Editing" : " Viewing"}
            </span>
          </div>
          
          {/* Quick Stats - REMOVE OR COMMENT OUT FOR NOW */}
          {/* <div className="sidebar-stats">
            <div className="stat-card">
              <span className="stat-number">12</span>
              <span className="stat-label">Active Forms</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">47</span>
              <span className="stat-label">Submissions</span>
            </div>
          </div> */}

          {/* ADMIN FORMS COMPONENT - MAKE SURE THIS IS RENDERED */}
          <AdminForms />
        </div>
      </div>

      {/* Details */}
      <div className="content">
        {formId ? (
          <div className="form-details">
            <AdminFormDetails />
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <div className="empty-state-icon">
                <span></span>
              </div>
              <h3 className="empty-state-title">Form Builder Dashboard</h3>
              <p className="empty-state-text">
                Select a form to edit or create a new one to start building your onboarding workflow.
              </p>
              
              <div className="feature-showcase">
                <h4>Powerful Form Features:</h4>
                <div className="feature-grid">
                  <div className="feature-card">
                    <span className="feature-icon"></span>
                    <h5>Dynamic Field Types</h5>
                    <p>Text, numbers, dates, dropdowns, checkboxes, file uploads</p>
                  </div>
                  <div className="feature-card">
                    <span className="feature-icon"></span>
                    <h5>Conditional Logic</h5>
                    <p>Show/hide fields based on previous answers</p>
                  </div>
                  <div className="feature-card">
                    <span className="feature-icon"></span>
                    <h5>Real-time Validation</h5>
                    <p>Custom validation rules and error messages</p>
                  </div>
                  <div className="feature-card">
                    <span className="feature-icon"></span>
                    <h5>Smart Notifications</h5>
                    <p>Instant alerts for new submissions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Client Forms Selection Layout
const ClientFormsLayout = () => {
  return (
    <div className="client-layout">
      <div className="client-content">
        <ClientForms />
      </div>
    </div>
  );
};

// Client Form Wrapper Component
const ClientFormWrapper = () => {
  const { formId } = useParams();
  
  if (!formId) {
    return (
      <div className="client-layout">
        <div className="client-content">
          <div className="client-empty-state">
            <div className="client-empty-icon">
              <span></span>
            </div>
            <h3 className="client-empty-title">Form Not Found</h3>
            <p className="client-empty-text">
              Please check the form URL or contact administrator.
            </p>
            <div className="client-empty-actions">
              <button
                onClick={() => window.location.href = '/client'}
                className="switch-button"
              >
                ← Back to Forms List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="client-layout">
      <div className="client-content">
        <DynamicForm />
      </div>
    </div>
  );
};


// 404 Not Found Component
const NotFound = () => {
  return (
    <div className="client-layout">
      <div className="client-content">
        <div className="not-found-state">
          <div className="not-found-icon">
            <span>🔍</span>
          </div>
          <h3 className="not-found-title">Page Not Found</h3>
          <p className="not-found-text">
            The page you're looking for doesn't exist in our onboarding platform.
          </p>
          <div className="not-found-actions">
            <button
              onClick={() => window.location.href = '/admin'}
              className="action-button primary"
            >
               Go to Admin Portal
            </button>
            <button
              onClick={() => window.location.href = '/client'}
              className="action-button secondary"
            >
               Go to Client Forms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
