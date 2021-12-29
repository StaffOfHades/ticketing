import { Request as GenericRequest, Response, Router } from "express"
import { body, validationResult } from 'express-validator'

import { BadRequestError, RequestValidationError } from '../../types/errors'
import { UserModel } from '../models/user'

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
  async (req: Request<UserLogin>, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const newUser = UserModel.build({ email, password });
    await newUser.save();

    res.status(201).send(newUser)
  }
);
