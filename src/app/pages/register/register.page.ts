import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ToastController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
// import { LocalDatabaseService } from 'src/app/services/local-database.service';
import { SqliteService } from 'src/app/services/sqlite.service';

function adultValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dob = control.value;
    if (!dob) return null; // no value, no error

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= minAge ? null : { underage: { valid: false, minAge } };
  };
}


@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit{
  registerForm: FormGroup;
  selectedGender: string = '';

  constructor(private fb: FormBuilder, private toastController: ToastController, private router: Router, private sqliteServices: SqliteService, private platform: Platform) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)
      ]],
      contact: ['', Validators.pattern(/^\d{10}$/)],
      dob: ['', adultValidator(18)],
      country: [''],
      gender: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@&$^])[A-Za-z\d@&$^]{6,}$/)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    },{ validators: this.passwordMatchValidator });

    this.platform.ready().then(() => {
    this.sqliteServices.createDatabase();
  });
  }
  
  ngOnInit() {
}


  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }


  get f() {
    return this.registerForm.controls;
  }


  async showToast(message: string) {
  const toast = await this.toastController.create({
    message,
    duration: 2000,
    color: 'danger',
    position: 'top',
  });
  await toast.present();
}

  async onSubmit() {
    if (this.registerForm.valid) {
      const user = this.registerForm.value;
      const result = await this.sqliteServices.insertuser(user);
      if (result.success) {
        this.router.navigate(['/show-details']);
      } else {
        this.showToast(result.error || 'Registration failed');
      }
    }
    else{
      Object.keys(this.registerForm.controls).forEach(field => {
      const control = this.registerForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    return;

    }
  }
}
