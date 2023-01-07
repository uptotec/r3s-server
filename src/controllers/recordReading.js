import NodeCache from 'node-cache';

import Reading from '../models/readings.js';

const cache = new NodeCache();
const LASTREADING = 'lastReading';

const recordReading = async (req, res) => {
  const { t, s } = req.query;

  if (!t || !s) {
    res.sendStatus(400);
    return;
  }

  const temp = Number(t),
    salinity = Number(s);

  const cacheExist = cache.has(LASTREADING);

  console.log(cacheExist);

  let latestReading;

  if (cacheExist) {
    latestReading = await cache.get(LASTREADING);
  } else {
    const reading = await Reading.findOne().sort({ createdAt: -1 });
    latestReading = reading.createdAt.toString();
    cache.set(LASTREADING, latestReading);
  }

  if (new Date() - new Date(latestReading) > 60 * 60 * 1000) {
    const newReading = await new Reading({ temp, salinity }).save();
    cache.set(LASTREADING, newReading.createdAt.toString());
  }

  req.wss.clients.forEach(function (client) {
    client.send(JSON.stringify({ temp, salinity }));
  });

  res.sendStatus(200);
};

export default recordReading;
