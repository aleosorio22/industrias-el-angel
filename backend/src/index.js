const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
