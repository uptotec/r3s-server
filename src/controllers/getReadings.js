import dateFns from 'date-fns';

import Reading from '../models/readings.js';

const getReadings = async (req, res) => {
  const { s, e } = req.query;

  if (!s || !e) {
    res.sendStatus(400);
    return;
  }

  const startDate = new Date(s);
  const endDate = new Date(e);

  const dayDifference = dateFns.differenceInDays(endDate, startDate);

  let readings = await Reading.find({
    createdAt: {
      $gte: dateFns.startOfDay(startDate),
      $lte: dateFns.endOfDay(endDate),
    },
  }).sort({ createdAt: -1 });

  const tmp = {};

  if (dayDifference > 2 && readings.length > 1) {
    readings.forEach(function (item) {
      var obj = (tmp[dateFns.startOfDay(item.createdAt)] = tmp[
        dateFns.startOfDay(item.createdAt)
      ] || { count: 0, temp: 0, salinity: 0, growthRate: 0, leafArea: 0 });

      obj.count++;
      obj.temp += item.temp;
      obj.salinity += item.salinity;
      obj.growthRate += item.growthRate;
      obj.leafArea += item.leafArea;
    });

    readings = [];

    for (const [key, value] of Object.entries(tmp)) {
      const entry = {
        createdAt: new Date(key).toISOString(),
        temp: value.temp / value.count,
        salinity: value.salinity / value.count,
        growthRate: value.growthRate / value.count,
        leafArea: value.leafArea / value.count,
      };
      readings.push(entry);
    }
  }

  res.status(200).json(readings);
};

export default getReadings;
