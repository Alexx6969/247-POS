// Import dependencies
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const TAX_RATE = 0.1; // 10% sales tax

// In-memory data storage (mock database)
let users = [];
let products = [
    { id: 1, name: 'Bread', price: 2.50 },
    { id: 2, name: 'Flour', price: 3.50 },
    { id: 3, name: 'Cereal', price: 4.00 },
    { id: 4, name: 'Noodles', price: 1.50 },
    { id: 5, name: 'Small soda', price: 1.00 },
    { id: 6, name: 'Big soda', price: 2.00 },
    { id: 7, name: 'Pack of beer', price: 12.00 },
    { id: 8, name: 'Chips', price: 2.00 },
    { id: 9, name: 'Coffee', price: 5.00 },
    { id: 10, name: 'News paper', price: 1.00 },
    { id: 11, name: 'Meat', price: 8.00 },
    { id: 12, name: 'Milk', price: 2.50 },
    { id: 13, name: 'Juice', price: 3.00 },
    { id: 14, name: 'Yogurt', price: 1.00 },
    { id: 15, name: 'Peas', price: 1.50 },
    { id: 16, name: 'Corn', price: 1.50 },
    { id: 17, name: 'Single beers', price: 1.00 },
    { id: 18, name: 'Mayo', price: 3.00 },
    { id: 19, name: 'Sweet corn', price: 1.50 },
    { id: 20, name: 'Chopped tomatoes', price: 1.00 },
    { id: 21, name: 'Ketchup', price: 2.50 },
    { id: 22, name: 'Canned pickles', price: 3.00 },
    { id: 23, name: 'Chocolate candy', price: 1.50 },
    { id: 24, name: 'Candy', price: 1.00 },
    { id: 25, name: 'Lotto', price: 2.00 },
    { id: 26, name: 'Cigarettes', price: 10.00 },
    { id: 27, name: '2 big pack of batteries', price: 6.00 },
    { id: 28, name: 'Sunglasses', price: 15.00 },
    { id: 29, name: 'Medicine', price: 5.00 },
    { id: 30, name: 'Fruits', price: 4.00 }
];
let sales = [];

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON data
app.use(
    session({
        secret: 'pos-secret-key',
        resave: false,
        saveUninitialized: true,
    })
);

// Set static files and view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mock admin session for development
app.use((req, res, next) => {
    if (!req.session.user) {
        req.session.user = {
            id: 1,
            username: 'Admin',
            role: 'admin',
        };
    }
    next();
});

// ---------------- ROUTES ---------------- //

// Home Route
app.get('/', (req, res) => {
    res.render('index'); // Render homepage (index.ejs)
});

// Login Route
app.get('/auth/login', (req, res) => {
    res.render('login'); // Render login page (login.ejs)
});

// Signup Route
app.get('/auth/signup', (req, res) => {
    res.render('signup'); // Render signup page (signup.ejs)
});

// Signup Logic
app.post('/auth/signup', (req, res) => {
    const { username, password, role, adminCode } = req.body;

    if (role === 'admin' && adminCode !== ADMIN_SECRET_CODE) {
        return res.status(400).send('Invalid admin secret code.');
    }

    // Simulate user creation in memory
    const newUser = { id: users.length + 1, username, password, role };
    users.push(newUser);
    res.send('User created successfully!');
});

// Login Logic
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user || user.password !== password) {
        return res.status(401).send('Invalid credentials.');
    }

    // Set session
    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.redirect(user.role === 'admin' ? '/admin/dashboard' : '/employee-dashboard');
});

// Logout Route
app.get('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/auth/login');
    });
});

// Employee Dashboard Route
app.get('/employee-dashboard', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'employee') {
    }
    res.render('employee-dashboard'); // Render employee dashboard (employee-dashboard.ejs)
});

// Employee POS Route
app.get('/employee/pos', (req, res) => {
    res.render('pos', { products }); // Render POS page with product list
});

// Employee Checkout Route
app.post('/employee/pos/checkout', (req, res) => {
    const { cart, employeeId } = req.body;

    if (!cart || cart.length === 0) {
        return res.status(400).send('Cart is empty.');
    }

    // Simulating saving sales to in-memory sales array
    cart.forEach(item => {
        const totalPrice = item.price * item.quantity * (1 + TAX_RATE);
        const sale = { ...item, totalPrice, employeeId, timestamp: new Date() };
        sales.push(sale);
    });

    res.send('Sale successfully saved.');
});

// Employee Sales History Route
app.get('/employee/sales', (req, res) => {
    res.render('sales', { sales }); // Render sales history page
});

// ---------------- START SERVER ---------------- //
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// ---------------- MOCK DATA ---------------- //
// For testing, the initial mock data is already set for users, products, and sales in memory
