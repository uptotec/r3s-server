import Reading from '../models/readings.js';

const recordReading = async (req, res) => {
  const { t, s } = req.query;

  if (!t || !s) {
    res.sendStatus(400);
    return;
  }

  const temp = Number(t),
    salinity = Number(s);

  const latestReading = await Reading.findOne().sort({ createdAt: -1 });

  if (new Date() - latestReading.createdAt > 60 * 60 * 1000) {
    await new Reading({ temp, salinity }).save();
  }

  res.sendStatus(200);
};

export default recordReading;
