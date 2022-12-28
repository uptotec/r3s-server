import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import recordReading from './controllers/recordReading.js';

const app = express();

app.use(cors({ credentials: true }));

app.get('/recordReading', recordReading);

mongoose.set('strictQuery', true);

const mongoDB =
  'mongodb+srv://uptotec:STEM%402022@stem.2moxvvu.mongodb.net/stem?retryWrites=true&w=majority';

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`server started at http://localhost:${port}`);
    });
  });
