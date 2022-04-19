import { Stan } from 'node-nats-streaming';

import { Event } from '../types/events/event';
import { promiseWithTimeout } from './utilities';

export abstract class MessagePublisher<E extends Event> {
  constructor(
    private client: Stan,
    private subject: E['subject'],
    private timeout = 10 * 1000
  ) {}

  publish(data: E['data']): Promise<void> {
    return promiseWithTimeout(
      new Promise((resolve, reject) => {
        this.client.publish(this.subject, JSON.stringify(data), (error) => {
          if (error) {
            return reject(error);
          }

          console.log(`[${this.subject}] - Event Published`);
          resolve();
        });
      }),
      this.timeout
    );
  }
}
