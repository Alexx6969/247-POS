const express = require('express');
const router = express.Router();

// Mock Products
const products = require('./admin').products;

// Employee Dashboard Route
router.get('/', (req, res) => {
    if (req.session.user && req.session.user.role === 'employee') {
        res.render('employee-dashboard', { products });
    } else {
        res.redirect('/auth/login');
    }
});

// Checkout Route
router.post('/checkout', (req, res) => {
    const { id, quantity } = req.body;
    const product = products.find(p => p.id === parseInt(id));

    if (product && product.stock >= quantity) {
        product.stock -= quantity;
        res.send(`Checked out ${quantity} of ${product.name}.`);
    } else {
        res.status(400).send('Invalid product or insufficient stock');
    }
});

module.exports = router;
