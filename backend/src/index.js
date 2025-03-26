const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const unitRoutes = require('./routes/unitRoutes');
const presentationRoutes = require('./routes/presentationRoutes');
const productRoutes = require('./routes/productRoutes');
const conversionRoutes = require('./routes/conversionRoutes');
const clientRoutes = require('./routes/clientRoutes');
const branchRoutes = require ('./routes/branchRoutes')
const orderRoutes = require('./routes/orderRoutes')

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/presentations', presentationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/conversions', conversionRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/orders', orderRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
