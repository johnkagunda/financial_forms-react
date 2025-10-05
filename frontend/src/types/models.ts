export interface Field {
  id: number;
  label: string;
  field_type: "text" | "number" | "date" | "dropdown" | "checkbox" | "file";
  required: boolean;
  options?: string[] | null;
}

export interface Form {
  id: number;
  name: string;
  description?: string;
  fields: Field[];
}

export interface Submission {
  id: number;
  form: number;
  data: Record<string, any>;
  files?: string;
  submitted_at: string;
}
