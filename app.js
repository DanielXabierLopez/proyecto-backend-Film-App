const express = require('express');
const path = require('path');
require('dotenv').config();
require('./config/sqlDB');
const connectDB = require('./config/mongoDB');

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const viewsRoutes = require("./routes/views.routes");
const movieRoutes = require("./routes/movie.routes");
const favoritesRoutes = require("./routes/favorites.routes");
const fakeUser = require('./middlewares/fakeUser.middleware');
const checkRole = require('./middlewares/role.middleware');

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

// TEMPORAL: usuario falso en req.user hasta que exista la autenticación
app.use(fakeUser);

// Rutas de las vistas (Pug)
app.use('/', viewsRoutes);

// Rutas de la API
app.use('/api', movieRoutes);
app.use('/api/favorites', checkRole(['user']), favoritesRoutes);

// Solo arrancamos el servidor si MongoDB conecta
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(() => {
        console.error('No se pudo conectar a MongoDB. El servidor no se ha iniciado.');
        process.exit(1);
    });
const userRoutes = require("./routes/user.routes");

app.use("/api", userRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);