import { Router } from "express"

export const signoutRouter = Router();

signoutRouter.post('/users/signout', (req, res) => {
  req.session = null;
  res.status(204).send()
});
