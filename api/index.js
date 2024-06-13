import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import FacturRoutes from './routes/FactureRoute.js';
import productRouter from './routes/ProductRoute.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import contactRoutes from './routes/ContactRoutes.js'
import cartRouter  from './routes/CartRoute.js';
import commandeRoutes from './routes/CommandRoute.js'
import eventRouter from './routes/EventRoute.js'
import projectRoutes from './routes/ProjectRoutes.js'
import devisRouter from './routes/DevisRouter.js';
import productCartRoute from './routes/ProductCartRoute.js'
import NotificationService from './utils/NotificationService.js';
import { Server } from 'socket.io';
import http from 'http';
import notificationRoutes from './routes/NotificationRoute.js';
import { checkEvents } from './controllers/EventController.js';
dotenv.config();

mongoose
  .connect("mongodb+srv://artvm:ghazi123@cluster0.h8ngjyw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Autorisez les requêtes CORS de votre frontend
    methods: ['GET', 'POST'],
  },
});
const notificationService = new NotificationService(io);
app.set('notificationService', notificationService);

setInterval(async () => {
  try {
    await checkEvents(notificationService);
  } catch (error) {
    console.error('Error checking events:', error);
  }
}, 60000);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/factures', FacturRoutes);
app.use('/api', contactRoutes);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/commande', commandeRoutes);
app.use('/api/events', eventRouter);
app.use('/api/project', projectRoutes);
app.use('/api/devis', devisRouter);
app.use("/api/productCard", productCartRoute);
app.use('/api/notifications', notificationRoutes);

// Servir des fichiers statiques
// Assurez-vous de configurer le chemin correct vers vos fichiers statiques
// app.use(express.static(path.join(__dirname, '/client/dist')));

// Gérer les erreurs
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error('Error:', err);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
server.listen(3000, () => {
  console.log('Server is running on port 3000!');
});