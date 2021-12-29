import { Router } from "express"

export const currentUserRouter = Router();

currentUserRouter.get('/users/currentuser', (req, res) => {
  res.send({ message: 'Welcome to authentication!' });
});
