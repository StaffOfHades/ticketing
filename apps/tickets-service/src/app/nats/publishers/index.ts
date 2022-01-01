import {
  Client,
  MessagePublisher,
  MessageSubject,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from '@udemy.com/nats/common';

export class TicketCreatedPublisher extends MessagePublisher<TicketCreatedEvent> {
  constructor(client: Client) {
    super(client, MessageSubject.TicketCreated);
  }
}

export class TicketUpdatedPublisher extends MessagePublisher<TicketUpdatedEvent> {
  constructor(client: Client) {
    super(client, MessageSubject.TicketUpdated);
  }
}
