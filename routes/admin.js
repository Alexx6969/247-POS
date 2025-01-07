const express = require('express');
const router = express.Router();

// Default product list with realistic prices
let products = [
    { id: 1, name: 'Bread', price: 2.5, stock: 20 },
    { id: 2, name: 'Cereal', price: 4.0, stock: 15 },
    { id: 3, name: 'Noodles', price: 1.2, stock: 30 },
    { id: 4, name: 'Small Soda', price: 1.5, stock: 50 },
    { id: 5, name: 'Big Soda', price: 2.5, stock: 40 },
    { id: 6, name: 'Flour', price: 3.0, stock: 25 },
    { id: 7, name: 'Pack of Beer', price: 12.0, stock: 10 },
    { id: 8, name: 'Chips', price: 2.0, stock: 35 },
    { id: 9, name: 'Coffee', price: 6.0, stock: 15 },
    { id: 10, name: 'Newspaper', price: 1.0, stock: 50 },
    { id: 11, name: 'Meat', price: 8.0, stock: 20 },
    { id: 12, name: 'Milk', price: 3.5, stock: 25 },
    { id: 13, name: 'Juice', price: 3.0, stock: 30 },
    { id: 14, name: 'Yogurt', price: 1.5, stock: 20 },
    { id: 15, name: 'Peas', price: 1.0, stock: 25 },
    { id: 16, name: 'Corn', price: 1.0, stock: 25 },
    { id: 17, name: 'Single Beer', price: 2.0, stock: 20 },
    { id: 18, name: 'Mayo', price: 3.5, stock: 15 },
    { id: 19, name: 'Sweet Corn', price: 1.5, stock: 25 },
    { id: 20, name: 'Chopped Tomatoes', price: 2.0, stock: 20 },
    { id: 21, name: 'Ketchup', price: 3.0, stock: 15 },
    { id: 22, name: 'Canned Pickles', price: 4.0, stock: 10 },
    { id: 23, name: 'Chocolate Candy', price: 1.0, stock: 50 },
    { id: 24, name: 'Candy', price: 0.8, stock: 60 },
    { id: 25, name: 'Lotto', price: 2.0, stock: 30 },
    { id: 26, name: 'Cigarettes', price: 8.0, stock: 15 },
    { id: 27, name: '2 Big Pack of Batteries', price: 12.0, stock: 10 },
    { id: 28, name: 'Sunglasses', price: 20.0, stock: 5 },
    { id: 29, name: 'Medicine', price: 15.0, stock: 10 },
    { id: 30, name: 'Fruits', price: 4.0, stock: 20 },
];

// Admin dashboard
router.get('/', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return res.render('admin-dashboard', { products });
    }
    res.redirect('/auth/login');
});

// Add a product
router.post('/add-product', (req, res) => {
    const { name, price, stock } = req.body;
    const id = products.length + 1;
    products.push({ id, name, price: parseFloat(price), stock: parseInt(stock) });
    res.redirect('/admin');
});

// Remove a product
router.post('/remove-product', (req, res) => {
    const { id } = req.body;
    products = products.filter(p => p.id !== parseInt(id));
    res.redirect('/admin');
});

module.exports = router;
