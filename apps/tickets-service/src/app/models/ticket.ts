import { Document, HydratedDocument, Model, Schema, model } from 'mongoose';

export interface Ticket {
  price: number;
  title: string;
  userId: string;
}

interface TicketDocument extends Document, Ticket {
  createdAt: Date;
  updatedAt: Date;
}

interface TicketModel extends Model<TicketDocument> {
  build(ticket: Ticket): HydratedDocument<TicketDocument>;
}

const ticketSchema = new Schema<TicketDocument, TicketModel>(
  {
    price: { type: Number, required: true },
    title: { type: String, required: true },
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
      versionKey: false,
    },
  }
);

const build: TicketModel['build'] = (ticket) => new TicketModel(ticket);
ticketSchema.static('build', build);

export const TicketModel = model<TicketDocument, TicketModel>('Ticket', ticketSchema);
