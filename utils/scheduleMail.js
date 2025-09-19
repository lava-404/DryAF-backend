const cron = require("node-cron");
const sendEmail = require("./mailer"); // your mail function
const Users = require("../Models/Users");

const scheduleReminders = async () => {
  const users = await Users.find({}); // all users with plans

  users.forEach(user => {
    const { email, name, hydrationPlan } = user;
    if (!hydrationPlan || !hydrationPlan.reminders) return;

    hydrationPlan.reminders.forEach(reminder => {
      const [hour, minute] = reminder.time.split(":");
      const cronTime = `${minute} ${hour} * * *`; // node-cron format

      cron.schedule(cronTime, () => {
        const msg = `Hey ${name}, it's time to hydrate! Try drinking at least ${reminder.amountML}ml now 💧`;
        sendEmail(email, "💧 Hydration Reminder", msg);
        console.log(`Reminder sent to ${email} at ${reminder.time}`);
      });
    });
  });
};

module.exports = scheduleReminders;
