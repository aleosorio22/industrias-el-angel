const TemplateModel = require('../models/templateModel');

class TemplateController {
    /**
     * Crea una nueva plantilla de pedido
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async createTemplate(req, res) {
        try {
            const { nombre, productos } = req.body;
            
            if (!nombre || !productos || !Array.isArray(productos) || productos.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Datos incompletos. Se requiere nombre y al menos un producto' 
                });
            }
            
            const templateData = {
                usuario_id: req.user.id,
                nombre,
                productos
            };
            
            const templateId = await TemplateModel.create(templateData);
            
            res.status(201).json({
                success: true,
                message: 'Plantilla creada exitosamente',
                data: { id: templateId }
            });
        } catch (error) {
            console.error('Error al crear plantilla:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Error al crear la plantilla' 
            });
        }
    }
    
    /**
     * Obtiene todas las plantillas del usuario
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async getTemplates(req, res) {
        try {
            const isAdmin = req.user.rol === 'admin';
            let templates;
            
            if (isAdmin) {
                // Los administradores pueden ver todas las plantillas
                templates = await TemplateModel.findAll();
            } else {
                // Los usuarios normales solo ven sus propias plantillas
                templates = await TemplateModel.findByUserId(req.user.id);
            }
            
            res.json({
                success: true,
                data: templates
            });
        } catch (error) {
            console.error('Error al obtener plantillas:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener las plantillas' 
            });
        }
    }
    
    /**
     * Obtiene una plantilla por su ID
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async getTemplateById(req, res) {
        try {
            const templateId = req.params.id;
            const template = await TemplateModel.findById(templateId);
            
            if (!template) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Plantilla no encontrada' 
                });
            }
            
            // Verificar que el usuario tenga acceso a la plantilla
            const isAdmin = req.user.rol === 'admin';
            if (!isAdmin && template.usuario_id !== req.user.id) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'No tienes permiso para ver esta plantilla' 
                });
            }
            
            res.json({
                success: true,
                data: template
            });
        } catch (error) {
            console.error('Error al obtener plantilla:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener la plantilla' 
            });
        }
    }
    
    /**
     * Elimina una plantilla por su ID
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async deleteTemplate(req, res) {
        try {
            const templateId = req.params.id;
            
            // Verificar que la plantilla exista
            const template = await TemplateModel.findById(templateId);
            
            if (!template) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Plantilla no encontrada' 
                });
            }
            
            // Verificar que el usuario tenga permiso para eliminar la plantilla
            const isAdmin = req.user.rol === 'admin';
            if (!isAdmin && template.usuario_id !== req.user.id) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'No tienes permiso para eliminar esta plantilla' 
                });
            }
            
            await TemplateModel.delete(templateId);
            
            res.json({
                success: true,
                message: 'Plantilla eliminada correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar plantilla:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al eliminar la plantilla' 
            });
        }
    }
    
    /**
     * Actualiza una plantilla existente
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async updateTemplate(req, res) {
        try {
            const templateId = req.params.id;
            const { nombre, productos } = req.body;
            
            if (!nombre || !productos || !Array.isArray(productos) || productos.length === 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Datos incompletos. Se requiere nombre y al menos un producto' 
                });
            }
            
            // Verificar que la plantilla exista
            const template = await TemplateModel.findById(templateId);
            
            if (!template) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Plantilla no encontrada' 
                });
            }
            
            // Verificar que el usuario tenga permiso para editar la plantilla
            const isAdmin = req.user.rol === 'admin';
            if (!isAdmin && template.usuario_id !== req.user.id) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'No tienes permiso para editar esta plantilla' 
                });
            }
            
            const templateData = {
                id: templateId,
                nombre,
                productos
            };
            
            await TemplateModel.update(templateData);
            
            res.json({
                success: true,
                message: 'Plantilla actualizada correctamente'
            });
        } catch (error) {
            console.error('Error al actualizar plantilla:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Error al actualizar la plantilla' 
            });
        }
    }
    
    /**
     * Usa una plantilla para cargar productos al pedido actual
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    static async useTemplate(req, res) {
        try {
            const templateId = req.params.id;
            
            // Verificar que la plantilla exista
            const template = await TemplateModel.findById(templateId);
            
            if (!template) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Plantilla no encontrada' 
                });
            }
            
            // Verificar que el usuario tenga permiso para usar la plantilla
            const isAdmin = req.user.rol === 'admin';
            if (!isAdmin && template.usuario_id !== req.user.id) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'No tienes permiso para usar esta plantilla' 
                });
            }
            
            // Transformar los productos al formato esperado por el formulario de creación de pedidos
            const productosFormateados = template.productos.map(producto => ({
                producto_id: producto.producto_id,
                presentacion_id: producto.presentacion_id,
                cantidad: producto.cantidad
            }));
            
            // Devolver los productos de la plantilla para que el frontend los cargue
            res.json({
                success: true,
                message: 'Plantilla cargada correctamente',
                data: productosFormateados
            });
        } catch (error) {
            console.error('Error al usar plantilla:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al cargar la plantilla' 
            });
        }
    }
}

module.exports = TemplateController;