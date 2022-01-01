type ValueOf<T> = T[keyof T];

export const enum MessageSubject {
  TicketCreated = 'ticket.created',
  TicketUpdated = 'ticket.updated',
}
