const express = require('express');
const path = require('path');
require('dotenv').config();
require('./config/sqlDB');

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Nombre para la app de peliculas aquí - Inicio'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
const userRoutes = require("./routes/user.routes");

app.use("/api", userRoutes);