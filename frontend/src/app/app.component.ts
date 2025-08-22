import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    TaskListComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  title = 'Smart Task Manager';
  
  @ViewChild('taskList') taskList!: TaskListComponent;

  ngAfterViewInit() {
    // Initial load of tasks
    this.refreshTasks();
  }

  onTaskAdded() {
    // Refresh the task list when a new task is added
    this.refreshTasks();
  }

  refreshTasks() {
    if (this.taskList) {
      this.taskList.loadTasks();
    }
  }
}
