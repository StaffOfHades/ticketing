export * from './errors';

import { Request } from 'express';

export interface TypedRequest<T = unknown> extends Request {
  body: T;
}
