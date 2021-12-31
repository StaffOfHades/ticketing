import { Router } from 'express';

export const router = Router();

router.post('/users/signout', (req, res) => {
  req.session = null;
  res.status(204).send();
});


export { router as signoutRouter }
