import cron from "cron";
import https from "https";

const url = "https://expense-tracker-cl3k.onrender.com/login";

export const job = new cron.CronJob("*/14 * * * * *", function () {
  console.log("Running cron job");
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log("Ping successful");
    } else console.log("Ping failed");
  }).on("error", (err) => {
    console.log("Error while sending request",err);
  });
});

//Examples
// 14 * * * * - Every 14 minutes
// 0 0 * * * - Every day at midnight
// 0 0 1 * * - Every first day of the month at midnight
// 0 0 1 1 * - Every first day of the year at midnight
