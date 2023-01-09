import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { WebSocketServer } from 'ws';

import recordReading from './controllers/recordReading.js';
import getReadings from './controllers/getReadings.js';

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

app.use(function (req, _res, next) {
  req.wss = wss;
  next();
});

wss.on('connection', function connection(ws) {
  console.log('client connected');
});

app.use(cors({ credentials: true }));

app.get('/recordReading', recordReading);
app.get('/getReadings', getReadings);

mongoose.set('strictQuery', true);

const mongoDB =
  'mongodb+srv://uptotec:STEM%402022@stem.2moxvvu.mongodb.net/stem?retryWrites=true&w=majority';

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const port = process.env.PORT || 4000;
    server.listen(port, () => {
      console.log(`server started at http://localhost:${port}`);
    });
  });
