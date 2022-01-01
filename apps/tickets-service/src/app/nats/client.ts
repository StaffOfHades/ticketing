import { promiseWithTimeout } from '@udemy.com/nats/common';
import nats, { Stan } from 'node-nats-streaming';

class Client {
  private _instance: Stan | null = null;

  get instance() {
    if (this._instance === null) {
      throw new Error('Cannot use NATS client before connection');
    }
    return this._instance;
  }

  close(): Promise<void> {
    const promise: Promise<void> = promiseWithTimeout(
      new Promise((resolve, reject) => {
        this.instance.on('close', resolve);
        this.instance.on('error', reject);
      }),
      5 * 100
    );
    this.instance.close();
    return promise;
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._instance = nats.connect(clusterId, clientId, { url });

    return promiseWithTimeout(
      new Promise((resolve, reject) => {
        this.instance.on('connect', resolve);
        this.instance.on('error', reject);
      }),
      10 * 1000
    );
  }
}

export const client = new Client();
