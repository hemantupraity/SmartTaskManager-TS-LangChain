import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { CommonModule } from '@angular/common';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, AppComponent, TaskListComponent, AddTaskComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have TaskList component', () => {
    const taskListElement = fixture.nativeElement.querySelector('app-task-list');
    expect(taskListElement).toBeTruthy();
  });

  it('should have AddTask component', () => {
    const addTaskElement = fixture.nativeElement.querySelector('app-add-task');
    expect(addTaskElement).toBeTruthy();
  });
});
