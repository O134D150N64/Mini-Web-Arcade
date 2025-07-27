// Signup functionality
document.addEventListener('DOMContentLoaded', function() {
    // This will be triggered when the signup form is submitted
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        // Prevent the default form submission
        e.preventDefault();
        
        // Get the values from the form fields
        const email = document.getElementById('signup-email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const termsAccepted = document.getElementById('terms').checked;

        // Basic validation
        if (!email || !username || !password || !confirmPassword) {
            alert('Please fill in all fields!');
            return;
        }

        if (!termsAccepted) {
            alert('Please accept the terms and conditions!');
            return;
        }
        
        // Validate the form fields
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Check if the username or email already exists
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const emails = JSON.parse(localStorage.getItem('emails') || '{}');

        if (users[username]) {
            alert('Username already exists!');
            return;
        }
            
        if (emails[email]) {
            alert('Email already exists!');
            return;
        }

        // Store user data
        console.log('Signup successful for:', username);
        users[username] = password;
        emails[email] = username; // Store email mapping
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('emails', JSON.stringify(emails));
        alert('Sign up successful!');
        setTimeout(() => {
            window.location.href = './login.html'; // Redirect to the login page
        }, 1000); // Redirect after 1 second
    });
});        
