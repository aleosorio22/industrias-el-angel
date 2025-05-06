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
const productionAreaRoutes = require('./modules/sistema/routes/productionAreaRoutes')
const userProductionAreaRoutes = require('./modules/sistema/routes/userProductionAreaRoutes');
const productionAuthRoutes = require('./modules/sistema/routes/productionAuthRoutes');
const templateRoutes = require('./modules/sistema/routes/templateRoutes');
const graphRoutes = require('./modules/sistema/routes/graphRoutes');
const testNeo4jRoutes = require('./modules/sistema/routes/testRoutes');
const deliveryRoutes = require('./modules/sistema/routes/deliveryRoutes');
const plantRoutes = require('./modules/sistema/routes/plantRoutes'); // Importar nuevas rutas

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
app.use('/api/entregas', deliveryRoutes);
app.use('/api/areas-produccion', productionAreaRoutes);
app.use('/api/user-production-areas', userProductionAreaRoutes);
app.use('/api/production/auth', productionAuthRoutes);
app.use('/api/plantillas', templateRoutes);
app.use('/api/graph', graphRoutes);
app.use('/api/test', testNeo4jRoutes);
app.use('/api/plantas', plantRoutes); // Registrar las rutas de plantas

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal!' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
