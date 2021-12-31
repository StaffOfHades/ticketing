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

import { createTicketRouter } from './routes/create';
import { indexTicketRouter } from './routes/index-router';
import { showTicketRouter } from './routes/show';
import { updateTicketRouter } from './routes/update';

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
app.use(indexTicketRouter);
app.use(showTicketRouter);
app.use(createTicketRouter);
app.use(updateTicketRouter);

app.all('*', (req) => {
  throw new NotFoundError(req.path);
});

// Has to be called after errors occur to properly handle them
app.use(errorHandler);

export { app };
