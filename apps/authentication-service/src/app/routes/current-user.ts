import { Request, Response, Router } from 'express';
import { currentUser } from '@udemy.com/middlewares/authentication';

export const currentUserRouter = Router();

currentUserRouter.get('/users/current-user', currentUser, (req, res) => {
  res.status(200).send({ currentUser: req.currentUser ?? null });
});
