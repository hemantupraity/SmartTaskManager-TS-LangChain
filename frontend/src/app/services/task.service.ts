// task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, map, tap } from 'rxjs';

export interface Task {
  id?: string; // Auto generated GUID
  taskName: string;
  dueDate: string; // Date
  priority: string; // Low, Medium, High
  status?: string; // ToDo, InProgress, Done
  notes: string;
  reminder: string; // Date Time
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private API_URL = 'http://localhost:3003';  // Removed /api from here since it's already in the route

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong. Try again.'));
  }

  // Get all tasks
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.API_URL}/api/tasks`).pipe(
      catchError(this.handleError)
    );
  }

  // Add task
  addTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/api/tasks`, task).pipe(
      catchError(this.handleError)
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/api/tasks/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Update task
  updateTask(id: string | undefined, updates: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/api/tasks/${id}`, updates).pipe(
      catchError(this.handleError)
    );
  }

  // Delete task
  deleteTask(id: string | undefined): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/api/tasks/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  summarizeTodayTasks(tasks: Task[]) {
    return this.http.post<{ summary: { text: string } }>(`${this.API_URL}/api/tasks/summarize/today`, { tasks });
  }

  // Get prioritized tasks for today
  prioritizeToday(tasks: Task[]): Observable<{ tasks: Task[] }> {
    return this.http.post<{ tasks: Task[] }>(
      `${this.API_URL}/api/tasks/today-priority`,
      { tasks }
    ).pipe(
      catchError(this.handleError)
    );
  }

  suggestNextTask(tasks: Task[]): Observable<{ suggestion: string }> {
    console.log("Sending tasks to suggest-task endpoint:", JSON.stringify(tasks, null, 2));
    return this.http.post<{ suggestion: any }>(
      `${this.API_URL}/api/tasks/suggest-task`,
      { tasks }
    ).pipe(
      tap(response => console.log("Raw response from suggest-task:", response)),
      map(response => ({
        suggestion: response.suggestion || {
          suggestedTask: "No suggestion available",
          reason: "The system couldn't determine a suggested task."
        }
      })),
      catchError(error => {
        console.error("Error in suggestNextTask:", error);
        return throwError(() => error);
      })
    );
  }

  // New method for LangChain-based suggestions
  suggestNextTaskWithLangChain(tasks: Task[]): Observable<{ suggestion: any }> {
    return this.http.post<{ suggestion: any }>(
      `${this.API_URL}/api/langchain/suggest-next-task`,
      { tasks }
    );
  }

  // Get smart reminders for tasks
  getSmartReminders(tasks: any[]): Observable<{ reminders: any[] }> {
    return this.http.post<{ reminders: any[] }>(
      `${this.API_URL}/api/tasks/generate-reminders`,
      { tasks }
    );
  }
}
