

document.addEventListener('DOMContentLoaded', function() {

    // Signup functionality
    // This will be triggered when the signup button is clicked
    document.getElementById('signup-form').addEventListener('signup-button', function(e) {

        // Prevent the default form submission
        e.preventDefault();
    
        // Get the values from the form fields
        const email = document.getElementById('signup-email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
    
        // Validate the form fields
        if (password !== confirmPassword) {
        
            alert('Passwords do not match!');
            return;
        }

        // Check if the username or email already exists
        const users = JSON.parse(localStorage.getItem('users') || '{}');

        if (users[username]) {
        
            alert('Username already exists!');
            return;
        }
        else if(users[email]) {
        
            alert('Email already exists!');
            return;
        } 
        else {
            
            console.log('Signup successful for:', username);
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Signup successful!');
            setTimeout(() => {
                window.location.href = './login.html', 3000; // Redirect to the login page
            })
        }
    });
});