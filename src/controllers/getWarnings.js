import Warning from '../models/warning.js';

export const getWarnings = async (req, res) => {
  const warnings = await Warning.find({ dismissed: false }).sort({
    createdAt: -1,
  });

  res.status(200).json(warnings);
};

export const dismissWarning = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.sendStatus(400);
    return;
  }

  const warning = await Warning.findOne({ _id: id });

  warning.dismissed = true;

  await warning.save();

  res.sendStatus(200);
};
