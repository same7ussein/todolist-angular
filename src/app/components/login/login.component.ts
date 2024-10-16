import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements AfterViewInit, OnInit {
  email: string = '';
  password: string = '';
  allUsers: any[] = [];

  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('eyeIcon') eyeIcon!: ElementRef;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.passwordInput) {
      this.renderer.listen(this.passwordInput.nativeElement, 'copy', (e) =>
        e.preventDefault()
      );
      this.renderer.listen(this.passwordInput.nativeElement, 'cut', (e) =>
        e.preventDefault()
      );
      this.renderer.listen(this.passwordInput.nativeElement, 'paste', (e) =>
        e.preventDefault()
      );
    }
  }

  togglePasswordVisibility(): void {
    const passwordInputElement = this.passwordInput.nativeElement;
    const eyeIconElement = this.eyeIcon.nativeElement;

    if (passwordInputElement.type === 'password') {
      this.renderer.setAttribute(passwordInputElement, 'type', 'text');
      this.renderer.removeClass(eyeIconElement, 'fa-eye');
      this.renderer.addClass(eyeIconElement, 'fa-eye-slash');
    } else {
      this.renderer.setAttribute(passwordInputElement, 'type', 'password');
      this.renderer.removeClass(eyeIconElement, 'fa-eye-slash');
      this.renderer.addClass(eyeIconElement, 'fa-eye');
    }
  }

  signIn(): void {
    this._auth
      .getUserByEmailAndPassword(this.email, this.password)
      .subscribe((users) => {
        if (users.length > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Login Successfully',
            timer: 1500,
          }).then(() => {
            localStorage.setItem('userName', users[0].name);
            this.router.navigate(['/todolist']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Email or Password is Incorrect',
            timer: 1500,
          });
        }
      });
  }
}
