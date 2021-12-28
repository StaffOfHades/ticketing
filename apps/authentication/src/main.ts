/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import { json } from "body-parser";
import * as morgan from "morgan";
import * as process from 'process';

import { currentUserRouter } from './app/current-user'
import { signinRouter } from './app/signin'
import { signoutRouter } from './app/signout'
import { signupRouter } from './app/signup'

const app = express();
app.use(json())
app.use(morgan('dev'));

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

const port = process.env.port || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);

process.on('SIGINT', () => {
  console.info("Process interrupted")
  process.exit(0)
})
process.on('SIGTERM', () => {
  console.info("Process terminated")
  process.exit(0)
})
