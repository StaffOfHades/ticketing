import { Stan } from 'node-nats-streaming';

const publish: Stan['publish'] = jest.fn().mockImplementation((a, b, callback) => {
  callback();
});

export const client = {
  instance: { publish },
};
