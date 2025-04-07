const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const userRoutes = require('./modules/sistema/routes/userRoutes');
const categoryRoutes = require('./modules/sistema/routes/categoryRoutes');
const unitRoutes = require('./modules/sistema/routes/unitRoutes');
const presentationRoutes = require('./modules/sistema/routes/presentationRoutes');
const productRoutes = require('./modules/sistema/routes/productRoutes');
const productPresentations = require('./modules/sistema/routes/presentationProductRoutes')
const conversionRoutes = require('./modules/sistema/routes/conversionRoutes');
const clientRoutes = require('./modules/sistema/routes/clientRoutes');
const branchRoutes = require ('./modules/sistema/routes/branchRoutes')
const orderRoutes = require('./modules/sistema/routes/orderRoutes')

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
app.use('/api/product-presentations', productPresentations)
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
