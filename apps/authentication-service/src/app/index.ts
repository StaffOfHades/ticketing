/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NotFoundError, errorHandler } from '@udemy.com/middlewares/common';
import cookieSession from 'cookie-session';
import express from 'express';
import { json } from 'body-parser';
import morgan from 'morgan';

import 'express-async-errors';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();

app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({ secure: process.env.NODE_ENV !== 'test', signed: false })
);
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', (req) => {
  throw new NotFoundError(req.path);
});

// Has to be called after errors occur to properly handle them
app.use(errorHandler);

export { app };
