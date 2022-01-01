import { Event } from './event';
import { MessageSubject } from '../message-subject';

interface Ticket {
  id: string;
  price: number;
  title: string;
  userId: string;
}

export interface TicketCreatedEvent extends Event {
  data: Ticket;
  subject: MessageSubject.TicketCreated;
}

export interface TicketUpdatedEvent extends Event {
  data: Pick<Ticket, 'id'> & Partial<Omit<Ticket, 'id'>>;
  subject: MessageSubject.TicketUpdated;
}
