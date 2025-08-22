import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { ChangeDetectorRef } from '@angular/core';
import { AddTaskComponent } from '../add-task/add-task.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddTaskComponent,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})

export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  summary: string = '';
  suggestion: string = '';
  priorities: Task[] = [];
  isLoading: boolean = false;
  isDeleting: boolean = false;
  error: string | null = null;
  showAddTask: boolean = false;
  showPriorities: boolean = true;
  showNotesOnHover: boolean = false;
  smartReminders: any[] = [];
  showReminders = false;
  isLoadingReminders = false;
  remindersError: string | null = null;
selectedTask: Task | null = null;
isEditing = false;

  constructor(private taskService: TaskService,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadTasks();
  }

  openAddTaskModal(): void {
    this.isEditing = false;
    this.selectedTask = null;
    this.showAddTask = true;
  }

  onTaskAdded(): void {
    this.showAddTask = false;
    this.loadTasks();
  }

  refreshTasks(): void {
    this.loadTasks();
  }

  // editTask(taskId: string | undefined){
  //   console.log("Edit task : taskId", taskId);
  //   this.showAddTask = true;
  //   this.taskService.getTaskById(taskId!).subscribe({
  //     next: (task) => {
  //       console.log("task", task);
  //       this.selectedTask = { ...task };
  //       this.isEditing = true;
  //       this.showAddTask = true;
  //     },
  //     error: (err) => {
  //       console.error('Error loading task:', err);
  //       this.error = 'Failed to load task. Please try again later.';
  //     }
  //   });
  // }
  
  editTask(taskId: string | undefined): void {
    if (!taskId) {
      console.error('No task ID provided for editing');
      return;
    }
  
    this.isLoading = true;
    this.taskService.getTaskById(taskId).subscribe({
      next: (task: any) => {
        //console.log("task", task);
        this.selectedTask = { ...task.properties };
        this.selectedTask!.id = taskId;
        //console.log("Selected task", this.selectedTask);
        this.isEditing = true;
        this.showAddTask = true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.error = 'Failed to load task. Please try again later.';
        this.isLoading = false;
      }
    });
  }

   // Placeholder for delete functionality
   deleteTask(taskId: string | undefined): void {
    this.isDeleting = true;
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.loadTasks();
        this.isDeleting = false;
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        this.error = 'Failed to delete task. Please try again.';
        this.isDeleting = false;
      }
    });
  }

  loadTasks() {
    this.isLoading = true;
    this.error = null;
    
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        
        this.tasks = tasks;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.error = 'Failed to load tasks. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  getTodayTaskSummary() {
    if (this.tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length === 0) {
    if (this.tasks.length === 0) {
      this.error = 'No tasks available for today to generate summary';
      return;
    }
    }
    this.isLoading = true;
    const content = this.tasks.map(t => t.notes).filter(Boolean).join('. ');
    if (!content) {
      this.error = 'No task descriptions available to generate summary';
      this.isLoading = false;
      return;
    }
    this.taskService.summarizeTodayTasks(this.tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0])).subscribe({
      next: (res) => {
        this.summary = res.summary.text;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error generating summary:', err);
        this.error = 'Failed to generate summary. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getPrioritizedTasksForToday() {
    this.isLoading = true;
    this.showPriorities = true;
    this.error = null;
    
    // Get today's tasks
    const todayTasks = this.getTodaysTasks();
    
    if (todayTasks.length === 0) {
      this.error = 'No tasks available for today to prioritize';
      this.isLoading = false;
      return;
    }
    
    this.taskService.prioritizeToday(todayTasks).subscribe({
      next: (res: any) => {
        if (!res.priorities || res.priorities.length === 0) {
          this.error = 'No prioritized tasks returned';
          this.isLoading = false;
          return;
        }
        
        // Sort tasks by priority (High to Low)
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        this.priorities = JSON.parse(res.priorities).sort((a: any, b: any) => {
          return (priorityOrder[a.priority as keyof typeof priorityOrder] || 99) - 
                 (priorityOrder[b.priority as keyof typeof priorityOrder] || 99);
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error getting prioritized tasks:', err);
        this.error = 'Failed to get prioritized tasks. Please try again.';
        this.isLoading = false;
      }
    });
  }

  hidePriorities()
  {
    this.showPriorities = false;
    this.priorities = [];
  }

  getNextTaskRecommendation() {
    this.isLoading = true;
    this.error = null;

    this.taskService.suggestNextTask(this.tasks.filter(t => t.status !== 'Done' && t.status !== 'In Progress')).subscribe({
      next: (res: any) => {
        console.log("res", res);
        // Format the suggestion with task name and reason
        if (res.suggestion.suggestedTask && res.suggestion.reason) {
          this.suggestion = `${res.suggestion.suggestedTask}<br><br><b>Reason:</b> ${res.suggestion.reason}`;
        } else if (res.suggestion) {
          this.suggestion = res.suggestion;
        } else {
          this.suggestion = 'No specific recommendation available';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error getting task recommendation:', err);
        this.error = 'Failed to get task recommendation. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  // Helper method to get today's tasks
  private getTodaysTasks(): Task[] {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(task => task.dueDate === today);
  }

  generateSmartReminders() {
    if (!this.tasks || this.tasks.length === 0) {
      this.remindersError = 'No tasks available to generate reminders';
      return;
    }

    this.isLoadingReminders = true;
    this.remindersError = null;
    
    this.taskService.getSmartReminders(this.tasks).subscribe({
      next: (response: any) => {
        if (response.agentResult && response.agentResult.length > 0) {
          this.smartReminders = response.agentResult;
          this.showReminders = true;
        } else {
          this.remindersError = 'No reminders generated. All tasks might be completed or not due soon.';
        }
        this.isLoadingReminders = false;
      },
      error: (error) => {
        console.error('Error generating smart reminders:', error);
        this.remindersError = 'Failed to generate smart reminders. Please try again.';
        this.isLoadingReminders = false;
      }
    });
  }

  closeReminders() {
    this.showReminders = false;
    this.smartReminders = [];
  }
}

 