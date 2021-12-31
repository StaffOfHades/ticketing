type ValueOf<T> = T[keyof T];

export const enum Subjects {
  TicketCreated = 'ticket.created',
  TicketUpdated = 'ticket.updated',
}
