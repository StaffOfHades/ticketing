import { Router } from "express"

export const signinRouter = Router();

signinRouter.post('/users/signin', (req, res) => {
  res.send({ message: 'Welcome to authentication!' });
});
