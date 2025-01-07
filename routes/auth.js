const express = require('express');
const router = express.Router();

// Mock Users
const users = [
    { id: 1, username: 'Admin', password: '24/7Manager', role: 'admin' },
    { id: 2, username: 'employee1', password: 'employee123', role: 'employee' },
];

// Login Route
router.get('/login', (req, res) => {
    res.render('login'); // Render the login.ejs view
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user; // Save user session
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard'); // Redirect Admin to their dashboard
        }
        return res.redirect('/employee/dashboard'); // Redirect Employees to their dashboard
    }

    res.status(401).send('Invalid username or password'); // Error message for invalid credentials
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login'); // Redirect to login after logout
});

module.exports = router;
