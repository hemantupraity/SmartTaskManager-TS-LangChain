export interface Task {
    id?: string; // Auto generated GUID
    taskName: string;
    dueDate: string; // Date
    priority: string; // Low, Medium, High
    status?: string; // ToDo, InProgress, Done
    notes: string;
    reminder: string; // Date Time
  }
  