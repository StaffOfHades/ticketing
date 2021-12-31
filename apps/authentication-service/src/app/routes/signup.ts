import { BadRequestError, TypedRequest, validateRequest } from '@udemy.com/middlewares/common';
import { Response, Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { UserModel } from '../models/user';

export const router = Router();

interface UserDetails {
  email: string;
  password: string;
}

router.post(
  '/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: TypedRequest<UserDetails>, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email already in use', 'email');
    }

    const newUser = UserModel.build({ email, password });
    await newUser.save();

    const userJWT = jwt.sign(
      { email: newUser.email, id: newUser.id },
      process.env.JWT_SIGNATURE
    );

    req.session = {
      jwt: userJWT,
    };

    res.status(201).send(newUser);
  }
);

export { router as signupRouter }
