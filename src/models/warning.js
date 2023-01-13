import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const warning = new Schema(
  {
    type: {
      type: String,
      enum: ['t', 's'],
    },

    range: [Number],

    dismissed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const warningModel = mongoose.model('warnings', warning);

export default warningModel;
