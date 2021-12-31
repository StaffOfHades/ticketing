import { BadRequestError, TypedRequest, validateRequest } from '@udemy.com/middlewares/common';
import { Response, Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { PasswordManager } from '../services/password-manager';
import { UserModel } from '../models/user';

const router = Router();

interface UserLogin {
  email: string;
  password: string;
}

router.post(
  '/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be provided'),
  ],
  validateRequest,
  async (req: TypedRequest<UserLogin>, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await PasswordManager.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const userJWT = jwt.sign(
      { email: existingUser.email, id: existingUser.id },
      process.env.JWT_SIGNATURE
    );

    req.session = {
      jwt: userJWT,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter }
