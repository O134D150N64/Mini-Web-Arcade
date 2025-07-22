document.addEventListener('DOMContentLoaded', function() {

    // Login functionality
    // This will be triggered when the login form is submitted
    document.getElementById('login-form').addEventListener('submit', function(e) {
        
        // Prevent the default form submission
        e.preventDefault();

        // Get the values from the form fields
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Basic validation
        if (!username || !password) {
            alert('Please fill in all fields!');
            return;
        }

        // Validate the form fields
        const users = JSON.parse(localStorage.getItem('users') || '{}');

        if (users[username] && users[username] === password) {
                
            console.log('Login successful for user:', username);
            localStorage.setItem('loggedInUser', username);
            alert('Login successful!');
            setTimeout(() => {
                window.location.href = './index.html'; // Redirect to the home page
            }, 1000); // Redirect after 1 second
        } else {
                
            alert('Invalid username or password!');
        }
    });
});