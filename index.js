import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import * as admin from 'firebase-admin';

import postRoutes from './routes/posts.js';

const app = express();
dotenv.config();

export default admin.default.initializeApp({
  credential: admin.default.credential.applicationDefault()
});

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve('../client-mysampleprojects.tech/build')));

app.use('/api/posts', postRoutes);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve('../client-mysampleprojects.tech/build', 'index.html'));
  });

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
.catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);
