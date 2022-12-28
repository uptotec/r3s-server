import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const reading = new Schema(
  {
    temp: Number,

    salinity: Number,

    growthRate: {
      type: Number,
      default: function () {
        return this.temp * 2;
      },
    },

    leafArea: {
      type: Number,
      default: function () {
        return this.salinity * 4;
      },
    },
  },
  { timestamps: true }
);

const ReadingsModel = mongoose.model('Readings', reading);

export default ReadingsModel;
