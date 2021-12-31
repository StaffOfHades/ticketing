import { Event } from './event';
import { Subjects } from '../subjects';

interface Ticket {
  id: string;
  price: number;
  title: string;
  userId: string;
}

export interface TicketCreatedEvent extends Event {
  data: Ticket;
  subject: Subjects.TicketCreated;
}

export interface TicketUpdatedEvent extends Event {
  data: Ticket['id'] & Partial<Omit<Ticket, 'id'>>;
  subject: Subjects.TicketUpdated;
}
