const express = require('express');
const router = express.Router();
const GraphModel = require('../models/graphModel');

router.get('/test-neo4j', async (req, res) => {
    try {
        const result = await GraphModel.testConnection();
        res.json({ success: true, mensaje: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
