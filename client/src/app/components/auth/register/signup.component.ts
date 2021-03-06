import { Router } from '@angular/router';
import { AuthService } from './../../../_services/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html'
})

export class SignupComponent {

    form: FormGroup;

    messageClass: string;
    message: string;
    processing = false;

    // Instant validation
    emailValid;
    emailMessage;
    usernameValid;
    usernameMessage;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.createForm();
    }


    // Function to create registration form
    createForm() {
        this.form = this.formBuilder.group({
            // Email Input
            email: ['', Validators.compose([
                Validators.required, // Field is required
                Validators.minLength(5), // Minimum length is 5 characters
                Validators.maxLength(30), // Maximum length is 30 characters
                this.validateEmail // Custom validation
            ])],
            // Username Input
            username: ['', Validators.compose([
                Validators.required, // Field is required
                Validators.minLength(3), // Minimum length is 3 characters
                Validators.maxLength(15), // Maximum length is 15 characters
                this.validateUsername // Custom validation
            ])],
            // Password Input
            password: ['', Validators.compose([
                Validators.required, // Field is required
                Validators.minLength(8), // Minimum length is 8 characters
                Validators.maxLength(35), // Maximum length is 35 characters
                // this.validatePassword // Custom validation
            ])],
            // Confirm Password Input
            confirm: ['', Validators.required] // Field is required
        }, { validator: this.matchingPasswords('password', 'confirm') }); // Add custom validator to form for matching passwords
    }


    disableForm(){
        this.form.controls['email'].disable();
        this.form.controls['username'].disable();
        this.form.controls['password'].disable();
        this.form.controls['confirm'].disable();
        
    }

    enableForm(){
        this.form.controls['email'].enable();
        this.form.controls['username'].enable();
        this.form.controls['password'].enable();
        this.form.controls['confirm'].enable();
    }

    // Function to validate e-mail is proper format
    validateEmail(controls) {
        // Create a regular expression
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        // Test email against regular expression
        if (regExp.test(controls.value)) {
            return null; // Return as valid email
        } else {
            return { 'validateEmail': true } // Return as invalid email
        }
    }

    // Function to validate username is proper format
    validateUsername(controls) {
        // Create a regular expression
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        // Test username against regular expression
        if (regExp.test(controls.value)) {
            return null; // Return as valid username
        } else {
            return { 'validateUsername': true } // Return as invalid username
        }
    }

    // Function to validate password
    validatePassword(controls) {
        // Create a regular expression
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        // Test password against regular expression
        if (regExp.test(controls.value)) {
            return null; // Return as valid password
        } else {
            return { 'validatePassword': true } // Return as invalid password
        }
    }

    // Funciton to ensure passwords match
    matchingPasswords(password, confirm) {
        return (group: FormGroup) => {
            // Check if both fields are the same
            if (group.controls[password].value === group.controls[confirm].value) {
                return null; // Return as a match
            } else {
                return { 'matchingPasswords': true } // Return as error: do not match
            }
        }
    }

    // Function to submit form
    onRegisterSubmit() {
        this.processing = true;
        this.disableForm();
        console.log(this.form.get('email').value);
        console.log(this.form.get('username').value);
        const user = {
            email: this.form.get('email').value,
            username: this.form.get('username').value,
            password: this.form.get('password').value,
        }
        this.authService.signup(user).subscribe(data => {
            if (!data.success) {
                this.messageClass = 'alert alert-danger';
                this.message = data.message;
                this.processing = false;
                this.enableForm();
            } else {
                this.messageClass = 'alert alert-success';
                this.message = data.message;
                setTimeout(() => {
                    this.router.navigate(['/home']);
                }, 1500)
            }
        });
        this.form.reset();
    }

    // checkUsername(){
    //     const username = this.form.get('username').value;
    //     this.authService.checkUsername(username).subscribe(data => {
    //         if (!data.success) {
    //             this.usernameValid = false;
    //             this.usernameMessage = data.message;
    //         } else {
    //             this.usernameValid = true;
    //             this.usernameMessage = data.message;
    //         }
    //     });
    // }

    // checkEmail(){
    //     const email = this.form.get('email').value;
    //     this.authService.checkUsername(email).subscribe(data => {
    //         if (!data.success) {
    //             this.emailValid = false;
    //             this.emailMessage = data.message;
    //         } else {
    //             this.emailValid = true;
    //             this.emailMessage = data.message;
    //         }
    //     });
    // }
}
