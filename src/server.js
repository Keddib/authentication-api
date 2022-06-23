import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import errorHundler from './middleware/error-hundler.js'
import auth from './routes/api/auth.js';
import users from './routes/api/users.js';
import root from './routes/root.js';
import { logger } from './middleware/event-logger.js';
import corsOptions from './config/cors-config.js'

dotenv.config();
const App = express();
const PORT = process.env.PORT || 3500;

// custom middleware logger
App.use(logger);

// Cross-origin resource sharing

App.use(cors(corsOptions));

App.use(express.json());


// routes
App.use('/', root);

App.use('/auth', auth);

App.use('/users', users);

App.all('*', (req, res) => {
  res.status(404);
  res.json({
    error: '404 not found'
  })
})

App.use(errorHundler);

App.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})
