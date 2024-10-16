import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  allUsers: any[] = [];
  isNameValid: boolean = true;
  isEmailValid: boolean = true;
  isPasswordValid: boolean = true;

  nameTouched: boolean = false;
  emailTouched: boolean = false;
  passwordTouched: boolean = false;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('eyeIcon') eyeIcon!: ElementRef;

  regexName = /^(\w){3,20}$/;
  regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  regexPass =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
  }

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

  validateName(): void {
    this.nameTouched = true;
    this.isNameValid = this.regexName.test(this.name);
    console.log(this.isNameValid);
  }

  validateEmail(): void {
    this.emailTouched = true;
    this.isEmailValid = this.regexEmail.test(this.email);
  }

  validatePassword(): void {
    this.passwordTouched = true;
    this.isPasswordValid = this.regexPass.test(this.password);
  }

  togglePasswordVisibility(): void {
    const passwordInputElement = this.passwordInput?.nativeElement;
    const eyeIconElement = this.eyeIcon?.nativeElement;

    if (passwordInputElement && eyeIconElement) {
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
  }

  signUp(): void {
    this.nameTouched = true;
    this.emailTouched = true;
    this.passwordTouched = true;

    this.validateName();
    this.validateEmail();
    this.validatePassword();

    if (this.isNameValid && this.isEmailValid && this.isPasswordValid) {
      this._auth.getUserByEmail(this.email).subscribe((users) => {
        if (users.length > 0) {
          Swal.fire({
            icon: 'error',
            title: 'Email Already Exists!',
            timer: 1000,
          });
        } else {
          const user = {
            name: this.name,
            email: this.email,
            pass: this.password,
          };

          this._auth.addUser(user).subscribe(() => {
            Swal.fire({
              icon: 'success',
              title: 'Sign Up Successfully',
              timer: 1500,
            }).then(() => {
              this.router.navigate(['/login']);
            });
          });
        }
      });
    }
  }
}
