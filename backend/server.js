import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import productsRouter from './routers/productsRouter.js';
import usersRouter from './routers/usersRouter.js';
import ordersRouter from './routers/ordersRouter.js';
import uploadsRouter from './routers/uploadsRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/emporium3', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use('/api/uploads', uploadsRouter); //Router for upload files
app.use('/api/users', usersRouter); // Route For user Routes 
app.use('/api/orders', ordersRouter);   //Routes For Order Routes
app.use('/api/products', productsRouter);  //Routes for Product Routes

// Route for Paypal 
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

const __dirname = path.resolve();

// file used to save uploaded files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

// Error Hanling 
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

//Seting Port
const port = process.env.PORT || 5000;

const httpServer = http.Server(app);
const srvr = new Server(httpServer, { cors: { origin: '*' } });
const users = [];

srvr.on('connection', (skt) => {
  skt.on('disconnect', () => {
    const user = users.find((x) => x.socketId === skt.id);
    if (user) {
      user.online = false;
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        srvr.to(admin.socketId).emit('updateUser', user);
      }
    }
  });

  skt.on('onLogin', (user) => {
    const updatedUser = {
      ...user,
      online: true,
      socketId: skt.id,
      messages: [],
    };
    const existUser = users.find((x) => x._id === updatedUser._id);
    if (existUser) {
      existUser.socketId = skt.id;
      existUser.online = true;
    } else {
      users.push(updatedUser);
    }
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      srvr.to(admin.socketId).emit('updateUser', updatedUser);
    }
    if (updatedUser.isAdmin) {
      srvr.to(updatedUser.socketId).emit('listUsers', users);
    }
  });

  skt.on('onUserSelected', (user) => {
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      const existUser = users.find((x) => x._id === user._id);
      srvr.to(admin.socketId).emit('selectUser', existUser);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
