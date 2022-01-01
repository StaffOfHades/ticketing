import { MessageSubject } from '../message-subject';

export interface Event {
  data: unknown;
  subject: MessageSubject;
}
