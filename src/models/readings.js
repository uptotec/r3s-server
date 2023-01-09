import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const reading = new Schema(
  {
    temp: Number,

    salinity: Number,

    growthRate: {
      type: Number,
      default: function () {
        return -0.48 * this.temp + 22;
      },
    },

    leafArea: {
      type: Number,
      default: function () {
        return -0.0091 * this.salinity + 2.1;
      },
    },
  },
  { timestamps: true }
);

const ReadingsModel = mongoose.model('Readings', reading);

export default ReadingsModel;
