document.addEventListener('DOMContentLoaded', function() {

    // Login functionality
    // This will be triggered when the login button is clicked
    document.getElementById('login-form').addEventListener('login-button', function(e) {
        
        // Prevent the default form submission
        e.preventDefault();

        // Get the values from the form fields
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Validate the form fields
        const users = JSON.parse(localStorage.getItem('users') || '{}');

        if (users[username] && users[username] === password) {
                
            console.log('Login successful for user:', username);
            localStorage.setItem('loggedInUser', username);
            alert('Login successful!');
            setTimeout(() => {
                window.location.href = './index.html'; // Redirect to the home page
            }, 3000); // Redirect after 3 seconds
        } else {
                
            alert('Invalid username or password!');
        }
    });
});