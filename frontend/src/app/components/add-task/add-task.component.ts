// In add-task.component.ts
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnChanges {
  @Input() taskToEdit: Task | null | any = null;
  @Input() isEditing: boolean = false;
  @Output() taskAdded = new EventEmitter<void>();
  
  task: Task = this.getDefaultTask();
  // isEditing = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private taskService: TaskService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskToEdit']?.currentValue) {
      const notionTask = changes['taskToEdit'].currentValue;
      // Transform Notion API response to our Task model
      this.task = {
        id: notionTask.id || '',
        taskName: this.extractTitle(notionTask.Title || notionTask.title || notionTask),
        dueDate: this.extractDate(notionTask.DueDate || notionTask.dueDate),
        priority: (this.extractRichText(notionTask.Priority || notionTask.priority) || 'Medium').trim(),
        notes: this.extractRichText(notionTask.Notes || notionTask.notes) || '',
        status: (this.extractRichText(notionTask.Status || notionTask.status) || 'ToDo').trim(),
        reminder: this.toDateTimeLocal(this.extractDateTime(notionTask.Reminder || notionTask.reminder) || '')
      };
      this.isEditing = true;
    } else if (this.taskToEdit === null) {
      this.task = this.getDefaultTask();
      this.isEditing = false;
    }
  }
  
  private extractRichText(richTextObj: any): string {
    try {
      // If it's already a string, return as is
      if (typeof richTextObj === 'string') return richTextObj;
      
      // Handle Notion rich text format
      if (richTextObj?.rich_text?.[0]?.plain_text) {
        return richTextObj.rich_text[0].plain_text;
      }
      
      // Handle direct plain text
      if (richTextObj?.plain_text) {
        return richTextObj.plain_text;
      }
      
      // Handle direct content
      if (richTextObj?.content) {
        return richTextObj.content;
      }
      
      return '';
    } catch (e) {
      console.warn('Error extracting rich text:', e, richTextObj);
      return '';
    }
  }
  
  private extractDate(dateObj: any): string {
    try {
      if (!dateObj) return '';
      
      // If it's already a date string, return as is
      if (typeof dateObj === 'string') {
        return dateObj.split('T')[0]; // Return just the date part
      }
      
      // Handle Notion date format
      if (dateObj?.date?.start) {
        return dateObj.date.start.split('T')[0];
      }
      
      // Handle direct date string
      if (dateObj?.start) {
        return dateObj.start.split('T')[0];
      }
      
      return '';
    } catch (e) {
      console.warn('Error extracting date:', e, dateObj);
      return '';
    }
  }
  
  private extractDateTime(dateObj: any): string {
    try {
      if (!dateObj) return '';
  
      // If it's already a date string, return as is
      if (typeof dateObj === 'string') {
        return dateObj; // keep full datetime
      }
  
      // Handle Notion date format
      if (dateObj?.date?.start) {
        return dateObj.date.start; // keep full datetime
      }
  
      // Handle direct date object
      if (dateObj?.start) {
        return dateObj.start; // keep full datetime
      }
  
      return '';
    } catch (e) {
      console.warn('Error extracting datetime:', e, dateObj);
      return '';
    }
  }  

  private toDateTimeLocal(utcString: string): string {
    if (!utcString) return '';
  
    const date = new Date(utcString); // will parse UTC
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  private extractTitle(titleObj: any): string {
    if (!titleObj?.title?.length) return 'Untitled Task';
    return titleObj.title[0]?.plain_text || 'Untitled Task';
  }

  private getDefaultTask(): Task {
    return { 
      id: '',
      taskName: '', 
      dueDate: new Date().toISOString().split('T')[0], 
      priority: 'Medium', 
      notes: '', 
      reminder: '', 
      status: 'ToDo' 
    };
  }

  submitTask() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Format reminder date if it exists
    if (this.task.reminder) {
      const local = new Date(this.task.reminder);
      this.task.reminder = local.toISOString();
    }

    const taskObservable = this.isEditing 
      ? this.taskService.updateTask(this.task.id, this.task)
      : (() => {
          this.task.id = crypto.randomUUID();
          return this.taskService.addTask(this.task);
        })();

    taskObservable.subscribe({
      next: () => {
        this.successMessage = `Task ${this.isEditing ? 'updated' : 'added'} successfully!`;
        if (!this.isEditing) {
          this.task = this.getDefaultTask();
        }
        this.taskAdded.emit();
      },
      error: (error) => {
        console.error('Error saving task:', error);
        this.errorMessage = `Failed to ${this.isEditing ? 'update' : 'add'} task. Please try again.`;
        this.isSubmitting = false;
      }
    });
  }

  private parseLocalDateTime(dateTimeString: string): Date {
    // Add your date parsing logic here if needed
    return new Date(dateTimeString);
  }
}