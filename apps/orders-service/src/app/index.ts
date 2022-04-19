/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NotFoundError, errorHandler } from '@udemy.com/middlewares/common';
import cookieSession from 'cookie-session';
import { currentUser } from '@udemy.com/middlewares/authentication';
import express from 'express';
import { json } from 'body-parser';
import morgan from 'morgan';

import 'express-async-errors';

import { createOrderRouter } from './routes/create';
import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes/index-router';
import { showOrderRouter } from './routes/show';

const app = express();

app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({ secure: process.env.NODE_ENV !== 'test', signed: false }));
app.use(
  morgan(
    'dev',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { skip: (req, res) => process.env.NODE_ENV === 'test' }
  )
);

app.use(currentUser);
app.use(createOrderRouter);
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);

app.all('*', (req) => {
  throw new NotFoundError(req.path);
});

// Has to be called after errors occur to properly handle them
app.use(errorHandler);

export { app };
