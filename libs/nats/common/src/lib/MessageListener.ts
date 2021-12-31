import { Message as NatsMessage, Stan, SubscriptionOptions } from 'node-nats-streaming';

import { Event } from '../types/events/event';
import { PromiseTimeoutError, promiseWithTimeout } from './utilities';

export type Message = Omit<NatsMessage, 'ack'>;

interface Options {
  ackWait?: number;
  queueGroup: string;
}

export abstract class MessageListener<E extends Event> {
  protected ackWait: number;
  private queueGroup: string;
  private subject: E['subject'];

  constructor(
    private client: Stan,
    { ackWait = 5 * 100, queueGroup, subject }: Options & E['subject']
  ) {
    this.ackWait = ackWait;
    this.queueGroup = queueGroup;
    this.subject = subject;
  }

  private subscriptionOptions(): SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroup);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroup,
      this.subscriptionOptions()
    );

    subscription.on('message', (message: NatsMessage) => {
      console.log(`${this.subject}:${this.queueGroup} - Message recieved`);
      const rawData = message.getData();
      const data = JSON.parse(
        typeof rawData === 'string' ? rawData : rawData.toString('utf-8')
      );
      promiseWithTimeout(this.handleMessage(data, message), this.ackWait)
        .then(() => message.ack())
        .catch((error) => {
          if (!(error instanceof PromiseTimeoutError)) {
            console.error(error);
          }
        });
    });
  }

  abstract handleMessage(data: E['data'], message: Message): Promise<unknown>;
}
