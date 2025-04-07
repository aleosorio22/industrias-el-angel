const ProductModel = require('../models/productModel');

exports.createProduct = async (req, res) => {
    try {
        // Verificar si el código ya existe
        const codeExists = await ProductModel.checkCodeExists(req.body.codigo);
        if (codeExists) {
            return res.status(400).json({ message: 'El código del producto ya existe' });
        }

        const productId = await ProductModel.create(req.body);
        res.status(201).json({ 
            message: 'Producto creado exitosamente',
            productId 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const products = await ProductModel.getAll(includeInactive);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        // Verificar si el código ya existe (excluyendo el producto actual)
        const codeExists = await ProductModel.checkCodeExists(req.body.codigo, req.params.id);
        if (codeExists) {
            return res.status(400).json({ message: 'El código del producto ya existe' });
        }

        const success = await ProductModel.update(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const success = await ProductModel.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.restoreProduct = async (req, res) => {
    try {
        const success = await ProductModel.restore(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto restaurado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};