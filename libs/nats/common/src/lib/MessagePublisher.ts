import { Stan } from 'node-nats-streaming';

import { Event } from '../types/events/event';

export abstract class MessagePublisher<E extends Event> {
  constructor(private client: Stan, private subject: E['subject']) {}

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(is.subject, JSON.stringify(data), (error) => {
        if (error) {
          return reject(error);
        }

        console.log(`[${this.subject}] - Event Published`);
        resolve();
      });
    });
  }
}
