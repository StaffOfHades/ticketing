import { Router } from "express"

export const signupRouter = Router();

signupRouter.post('/users/signup', (req, res) => {
  res.send({ message: 'Welcome to authentication!' });
});
