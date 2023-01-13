import dateFns from 'date-fns';

import getAverageReadings from './../utils/getAverageReadings.js';

const getReadings = async (req, res) => {
  const { s, e } = req.query;

  if (!s || !e) {
    res.sendStatus(400);
    return;
  }

  const startDate = new Date(s);
  const endDate = new Date(e);

  const readings = await getAverageReadings(startDate, endDate);

  res.status(200).json(readings);
};

export default getReadings;
