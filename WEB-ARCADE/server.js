document.getElementById('signup-form').addEventListener('submit', function(e) {

    e.preventDefault();

    const email = document.getElementById('signup-email').value;
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

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
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Signup successful!');
    }
});

document.getElementById('login-form').addEventListener('submit', function(e) {

    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username] && users[username] === password) {
        alert('Login successful!');
    } else {
        alert('Invalid username or password!');
    }
});