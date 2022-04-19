import { Document, HydratedDocument, Model, Schema, model } from 'mongoose';

import { TicketDocument } from './ticket';

export interface Order {
  expiresAt?: Data;
  status: string;
  ticket: TicketDocument;
  userId: string;
}

interface OrderDocument extends Document, Order {
  createdAt: Date;
  updatedAt: Date;
}

interface OrderModel extends Model<OrderDocument> {
  build(order: Order): HydratedDocument<OrderDocument>;
}

const orderSchema = new Schema<OrderDocument, OrderModel>(
  {
    expiresAt: { type: Schema.Types.Date, required: false },
    status: { type: String, required: true },
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' },
    userId: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    toJSON: {
      transform: (_, output) => {
        delete output._id;
        delete output.createdAt;
        delete output.updatedAt;
        return output;
      },
      virtuals: true,
    },
  }
);

const build: OrderModel['build'] = (order) => new OrderModel(order);
orderSchema.static('build', build);

export const OrderModel = model<OrderDocument, OrderModel>('Order', orderSchema);
