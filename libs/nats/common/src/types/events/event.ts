import { Subjects } from '../subjects';

export interface Event {
  data: unknown;
  subject: Subjects;
}
