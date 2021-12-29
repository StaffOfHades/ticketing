import { Router } from "express"

export const signoutRouter = Router();

signoutRouter.post('/users/signout', (req, res) => {
  res.send({ message: 'Welcome to authentication!' });
});
