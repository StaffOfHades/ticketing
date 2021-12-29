/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import { json } from "body-parser";
import * as mongoose from "mongoose"
import * as morgan from "morgan";
import * as process from 'process';

import 'express-async-errors';

import { NotFoundError } from './types/errors'

import { errorHandler} from './app/middlewares/error-handler'

import { currentUserRouter } from './app/routes/current-user'
import { signinRouter } from './app/routes/signin'
import { signoutRouter } from './app/routes/signout'
import { signupRouter } from './app/routes/signup'

const app = express();
app.use(json())
app.use(morgan('dev'));

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', (req) => {
  throw new NotFoundError(req.path)
})

// Has to be called after errors occur to properly handle them
app.use(errorHandler)

const port = process.env.port || 3000;

const start = async () => {
  try {
    await mongoose.connect("mongodb://authentication-mongo-clusterip-srv:27017/authentication")
    console.log("MongoDB connection to authentication ready")
  } catch(error) {
    console.error(error);
  }

  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });

  server.on('error', console.error);
}

process.on('SIGINT', () => {
  console.info("Process interrupted")
  process.exit(0)
})
process.on('SIGTERM', () => {
  console.info("Process terminated")
  process.exit(0)
})


start()
