# ACTSERV Financial Onboarding - Frontend 

A modern React frontend application for the ACTSERV Financial Onboarding platform, providing an intuitive interface for dynamic form building and client onboarding management.

##  Features

- **Dual Portal Architecture**: Separate admin and client experiences
- **Dynamic Form Builder**: Intuitive drag-and-drop form creation interface
- **Real-time Form Rendering**: Live preview of forms as you build them
- **Client Form Filling**: Clean, professional form completion experience
- **Real-time Notifications**: Live updates for new form submissions via WebSockets
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **TypeScript Safety**: Full type safety with comprehensive interfaces
- **Modern UI/UX**: Google Forms-inspired design with professional styling

## Technology Stack

- **Framework**: React 19.1.1 with TypeScript
- **Routing**: React Router DOM v7.9.3
- **Build Tool**: Vite 6.0+ (Ultra-fast development)
- **Styling**: CSS Custom Properties + Modular CSS
- **HTTP Client**: Axios for API communication
- **State Management**: React Hooks (useState/useEffect)
- **Development**: ESLint + TypeScript for code quality

##  Prerequisites

Before running the application, ensure you have:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Django Backend**: The backend API server running on `http://localhost:8000`

##  Installation & Setup

### 1. Clone and Navigate to Project

```bash
git clone <repository-url>
cd actserv_form
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install
```

### 3. Environment Configuration (Optional)

If you need to change the backend API URL, update the configuration:

```typescript
// frontend/src/utils/api.ts
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Change if backend is on different port
});
```

### 4. Start Development Server

```bash
# From the frontend directory
npm run dev

# Alternative: From project root
cd frontend && npm run dev
```

The application will be available at: **http://localhost:5173**

## 🚀 Quick Start

### 1. Start Both Backend and Frontend

**Terminal 1 - Start Django Backend:**
```bash
cd ../actserv/myprojo
python manage.py runserver
# Backend running at http://localhost:8000
```

**Terminal 2 - Start React Frontend:**
```bash
cd frontend
npm run dev
# Frontend running at http://localhost:5173
```

### 2. Access the Application

- **Frontend Application**: http://localhost:5173
- **Admin Portal**: http://localhost:5173/admin
- **Client Portal**: http://localhost:5173/client

### 3. Create Your First Form

1. **Open Admin Portal**: Click "Admin Portal" in the header
2. **Create Form**: Enter a form name (e.g., "KYC Application") and click "Create Form"
3. **Edit Form**: Click "Edit Form" on your newly created form
4. **Add Fields**: Use the form builder to add fields like:
   - Text fields for names and addresses
   - Dropdown for document types
   - Date fields for birthdates
   - File upload for document verification

### 4. Test Client Experience

1. **Switch to Client Portal**: Click "Client Portal" in the header
2. **Select Form**: Choose your form from the available forms list
3. **Fill Out Form**: Complete the form as a client would
4. **Submit**: Submit the form and see real-time notification in admin

## 📖 Application Structure

### Frontend Architecture

```
frontend/
├── public/                 # Static assets
│   └── vite.svg           # Vite logo
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── AdminForms.tsx          # Form management interface
│   │   ├── AdminFormDetails.tsx    # Form builder/editor
│   │   ├── AdminSubmissions.tsx    # Submission management
│   │   ├── DynamicForm.tsx         # Client form renderer
│   │   ├── ClientForms.tsx         # Client form selection
│   │   └── Notifications.tsx       # Real-time notifications
│   ├── types/             # TypeScript type definitions
│   │   └── models.ts      # Data models and interfaces
│   ├── utils/             # Utility functions
│   │   └── api.ts         # Axios API configuration
│   ├── styles/            # CSS stylesheets
│   │   └── theme.css      # Global styles and themes
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── package.json           # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

### Key Components Explained

#### AdminForms.tsx
- **Purpose**: Form management dashboard
- **Features**: Create, list, edit, and preview forms
- **Usage**: Admin users manage their form collection

#### AdminFormDetails.tsx
- **Purpose**: Form builder interface
- **Features**: Add/edit fields, configure validation, set field types
- **Usage**: Admins design and customize forms

#### DynamicForm.tsx
- **Purpose**: Client-facing form renderer
- **Features**: Renders forms dynamically based on field configuration
- **Usage**: End users fill out forms

#### ClientForms.tsx
- **Purpose**: Form selection interface for clients
- **Features**: Browse available forms, view descriptions
- **Usage**: Clients choose which forms to complete

## 🎯 User Workflows

### Admin Workflow: Creating a Form

1. **Navigate to Admin Portal** (`/admin`)
2. **Create New Form**:
   - Enter form name (e.g., "Investment Risk Assessment")
   - Click "Create Form"
3. **Edit Form** (`/admin/forms/{id}`):
   - Add text fields for personal information
   - Add dropdowns for investment preferences
   - Add checkboxes for risk acknowledgments
   - Configure field validation and requirements
4. **Preview Form**: Click "Preview" to test the client experience
5. **Monitor Submissions** (`/admin/submissions`)

### Client Workflow: Completing a Form

1. **Navigate to Client Portal** (`/client`)
2. **Browse Available Forms**: View forms with descriptions
3. **Select Form** (`/forms/{id}`):
   - Read form introduction and instructions
   - Complete all required fields
   - Upload any requested documents
4. **Submit Form**: Review and submit completed form
5. **Confirmation**: Receive submission confirmation

## 🔧 Configuration

### API Configuration

The frontend communicates with the Django backend through a centralized API configuration:

```typescript
// src/utils/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
```

### Vite Configuration

The build tool is configured for optimal development experience:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

### TypeScript Configuration

Strong typing is enforced throughout the application:

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Development Scripts

```bash
# Development server with hot reload
npm run dev

# Type checking without compilation
npm run type-check

# Linting and code quality
npm run lint

# Production build
npm run build

# Preview production build
npm run preview
```

##  Styling and Theming

### Design System

The application uses a consistent design system with CSS custom properties:

```css
/* Global design tokens */
:root {
  /* Colors */
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --success-color: #059669;
  --warning-color: #d97706;
  --error-color: #dc2626;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Layout */
  --border-radius: 8px;
  --box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
```

### Component Styling

Components use modular CSS classes for maintainability:

```css
/* Form styling */
.google-form-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: var(--spacing-lg);
}

/* Admin interface */
.admin-forms-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
```

## Security Considerations

### API Security
- **CORS Configuration**: Backend CORS settings allow frontend domain
- **Input Validation**: Client-side validation complements server-side validation
- **XSS Prevention**: React automatically escapes content to prevent XSS attacks

### Data Handling
- **Type Safety**: TypeScript prevents data type mismatches
- **Sanitization**: Form inputs are properly sanitized before submission
- **File Uploads**: File type and size validation for security

## 🚀 Deployment

### Development Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains optimized production files
# Serve these files with any static file server
```

### Production Deployment Options

#### Option 1: Static File Hosting (Netlify, Vercel)

```bash
# Build the application
npm run build

# Deploy the dist/ folder to your hosting service
# Configure rewrites for client-side routing:
# /*    /index.html   200
```

#### Option 2: Nginx/Apache Server

```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/dist;
    index index.html;
    
    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy to Django backend
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Option 3: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

##  Performance Optimization

### Build Optimization
- **Tree Shaking**: Vite automatically removes unused code
- **Code Splitting**: Route-based code splitting (future enhancement)
- **Asset Optimization**: Automatic image and asset optimization

### Runtime Performance
- **React Optimization**: Proper use of React.memo and useCallback
- **API Caching**: Consider adding React Query for API caching
- **Lazy Loading**: Components and routes loaded on demand

## 🐛 Troubleshooting

### Common Issues

#### Backend Connection Issues
```bash
# Problem: "Network Error" or API calls failing
# Solution: Ensure Django backend is running
cd ../actserv/myprojo
python manage.py runserver

# Check API endpoint is accessible
curl http://localhost:8000/api/forms/
```

#### Build Issues
```bash
# Problem: TypeScript compilation errors
# Solution: Check types and run type checking
npm run type-check

# Problem: Missing dependencies
# Solution: Reinstall node modules
rm -rf node_modules package-lock.json
npm install
```

#### Styling Issues
```bash
# Problem: Styles not loading properly
# Solution: Check CSS imports and clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### Debug Mode

Enable additional logging for development:

```typescript
// Add to api.ts for request/response logging
api.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

api.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});
```

##  Contributing

### Development Setup

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/new-component`
3. **Make Changes**: Follow TypeScript and React best practices
4. **Test Changes**: Ensure all functionality works
5. **Commit**: `git commit -m 'Add new form validation component'`
6. **Push**: `git push origin feature/new-component`
7. **Pull Request**: Create PR with detailed description

### Code Style Guidelines

- **TypeScript**: Use strict typing, no `any` types
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **CSS**: Use CSS custom properties, avoid inline styles
- **Imports**: Organize imports (React first, then libraries, then local)
