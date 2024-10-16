import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-todolist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.scss',
})
export class TodolistComponent {
  @ViewChild('inputBx') inputBx!: ElementRef;
  @ViewChild('list') list!: ElementRef;

  tasks: any[] = [];
  userName?: string | null;
  constructor(
    private router: Router,
    private taskService: TasksService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.userName = localStorage.getItem('userName');
      if (!this.userName) {
        this.router.navigate(['/login']);
      } else {
        this.loadTasks();
      }
    }
  }

  ngAfterViewInit(): void {
    this.inputBx.nativeElement.focus();
  }

  loadTasks(): void {
    this.taskService.getTasks(this.userName!).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  userLogout(): void {
    if (isPlatformBrowser(this._platformId)) {
      localStorage.removeItem('userName');
      localStorage.removeItem('loggedIn');
      this.router.navigate(['/login']);
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.addItem(this.inputBx.nativeElement.value);
      this.inputBx.nativeElement.value = '';
    }
  }
  addItem(inputBxValue: string, completed = false): void {
    if (inputBxValue.trim() !== '') {
      const newTask = {
        text: inputBxValue,
        completed,
        userName: this.userName,
      };

      this.taskService.addTask(newTask).subscribe((task) => {
        this.tasks.push(task);
      });
    }
  }
  toggleTaskCompletion(task: any): void {
    task.completed = !task.completed;
    this.taskService.updateTask(task).subscribe(() => {});
  }
  deleteTask(task: any, event: Event): void {
    event.stopPropagation();
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tasks = this.tasks.filter((t) => t !== task);
        Swal.fire({
          title: 'Deleted!',
          text: 'Your task has been deleted.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }
}
