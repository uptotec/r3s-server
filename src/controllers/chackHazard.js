import { startOfDay, subDays } from 'date-fns';
import getAverageReadings from './../utils/getAverageReadings.js';
import nodemailer from 'nodemailer';
import Warning from './../models/warning.js';

const transporter = nodemailer.createTransport({
  port: 465,
  host: 'smtp.zoho.com',
  auth: {
    user: 'technograss@zohomail.com',
    pass: 'Uptotec@2001',
  },
  secure: true,
});

const growthWarningMailData = (range) => ({
  from: 'technograss@zohomail.com', // sender address
  to: 'rovan.1620527@stemredsea.moe.edu.eg,Zahwa.1620531@stemredsea.moe.edu.eg,omnia.1620506@stemredsea.moe.edu.eg', // list of receivers
  subject: 'DANGER ZONE WARNING',
  html: `<b>WARNING!</b>
         <br>The temperature has been in the ${range[0]} – ${range[1]}-degree range for the last five days. If it lasted for another 9 - 14 days, the grass will grow at a slower rate of ${range[2]} – ${range[3]} mm per week.<br/>`,
});

const areaWarningMailData = (range) => ({
  from: 'technograss@zohomail.com', // sender address
  to: 'rovan.1620527@stemredsea.moe.edu.eg,Zahwa.1620531@stemredsea.moe.edu.eg,omnia.1620506@stemredsea.moe.edu.eg', // list of receivers
  subject: 'DANGER ZONE WARNING',
  html: `<b>WARNING!</b>
         <br>Salinity is above ${range[0]} (ppt, psu). If the salinity continued for 21- 30 days, the leaf area will decrease to ${range[2]} cm^2.<br/>`,
});

const checkHazard = async () => {
  console.log('cron job started');
  const today = startOfDay(new Date());

  const startDate = subDays(today, 5);

  const readings = await getAverageReadings(startDate, today);

  const rangeTemp = [Number.POSITIVE_INFINITY, 0];
  const rangeGrowth = [Number.POSITIVE_INFINITY, 0];
  const rangeSalinity = [Number.POSITIVE_INFINITY, 0];
  const rangeArea = [Number.POSITIVE_INFINITY, 0];

  console.log(readings);

  let count = 0;
  // cheking for growth rate warning
  readings.forEach((reading) => {
    if (reading.growthRate < 10.5) count++;
  });

  console.log(count);
  // send growth rate warning
  if (count >= 4) {
    console.log('here');
    readings.forEach((reading) => {
      rangeTemp[0] = rangeTemp[0] > reading.temp ? reading.temp : rangeTemp[0];
      rangeTemp[1] = rangeTemp[1] < reading.temp ? reading.temp : rangeTemp[1];

      rangeGrowth[0] =
        rangeGrowth[0] > reading.growthRate
          ? reading.growthRate
          : rangeGrowth[0];
      rangeGrowth[1] =
        rangeGrowth[1] < reading.growthRate
          ? reading.growthRate
          : rangeGrowth[1];
    });

    const warning = await new Warning({
      type: 't',
      range: [...rangeTemp, ...rangeGrowth],
      days: [startDate, today],
    }).save();

    await transporter.sendMail(growthWarningMailData(warning.range));
  }

  count = 0;
  // cheking for leaf Area warning
  readings.forEach((reading) => {
    if (reading.leafArea < 2.4) count++;
  });

  // send leaf Area warning
  if (count >= 4) {
    readings.forEach((reading) => {
      rangeSalinity[0] =
        rangeSalinity[0] > reading.salinity
          ? reading.salinity
          : rangeSalinity[0];

      rangeArea[0] =
        rangeArea[0] > reading.leafArea ? reading.leafArea : rangeArea[0];

      rangeSalinity[1] =
        rangeSalinity[1] < reading.salinity
          ? reading.salinity
          : rangeSalinity[1];

      rangeArea[1] =
        rangeArea[1] < reading.leafArea ? reading.leafArea : rangeArea[1];
    });

    const warning = await new Warning({
      type: 's',
      range: [...rangeSalinity, ...rangeArea],
      days: [startDate, today],
    }).save();

    await transporter.sendMail(areaWarningMailData(warning.range));
  }
};

export default checkHazard;
