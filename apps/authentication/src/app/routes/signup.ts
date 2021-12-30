import { Request as GenericRequest, Response, Router } from "express"
import { body } from 'express-validator'
import jwt from 'jsonwebtoken';

import { BadRequestError } from '../../types/errors'
import { UserModel } from '../models/user'
import { validateRequest } from '../middlewares/validate-request'

export const signupRouter = Router();

interface UserLogin {
  email: string;
  password: string;
}

interface Request<T = unknown> extends GenericRequest {
  body: T
}

signupRouter.post(
  '/users/signup',
  [
    body('email').isEmail().withMessage("Email must be valid"),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request<UserLogin>, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email already in use", 'email');
    }

    const newUser = UserModel.build({ email, password });
    await newUser.save();

    const userJWT = jwt.sign({ email: newUser.email, id: newUser.id }, process.env.JWT_SIGNATURE)

    req.session = {
      jwt: userJWT
    };

    res.status(201).send(newUser)
  }
);
