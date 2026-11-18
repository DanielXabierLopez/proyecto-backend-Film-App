const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Obtener información del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente
 */
router.get("/user", (req, res) => {

    res.status(200).json({
        message: "Usuario obtenido correctamente"
    });

});

module.exports = router;