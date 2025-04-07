const CategoryModel = require('../models/categoryModel');

exports.createCategory = async (req, res) => {
    try {
        const categoryId = await CategoryModel.create(req.body);
        res.status(201).json({ 
            message: 'Categoría creada exitosamente',
            categoryId 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.getAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await CategoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const success = await CategoryModel.update(req.params.id, req.body);
        if (!success) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const success = await CategoryModel.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.restoreCategory = async (req, res) => {
    try {
        const success = await CategoryModel.restore(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json({ message: 'Categoría restaurada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};