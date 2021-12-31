import { Router } from 'express';
import { currentUser } from '@udemy.com/middlewares/authentication';

const router = Router();

router.get('/users/current-user', currentUser, (req, res) => {
  res.status(200).send({ currentUser: req.currentUser ?? null });
});

export { router as currentUserRouter };
