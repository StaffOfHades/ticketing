import { BadRequestError, validateRequest } from '@udemy.com/middlewares/common';
import { Request as GenericRequest, Response, Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { PasswordManager } from '../services/password-manager';
import { UserModel } from '../models/user';

export const signinRouter = Router();

interface UserLogin {
  email: string;
  password: string;
}

interface Request<T = unknown> extends GenericRequest {
  body: T;
}

signinRouter.post(
  '/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be supplied'),
  ],
  validateRequest,
  async (req: Request<UserLogin>, res: Response) => {
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
