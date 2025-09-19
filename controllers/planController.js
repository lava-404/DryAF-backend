const { GoogleGenerativeAI } = require('@google/generative-ai');
const scheduleReminders = require("../utils/scheduleMail");
require('dotenv').config();

const Users = require("../Models/Users");

const api_Key = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(api_Key);

const generatePlan = async (req, res) => {
  const {
    sex, date, weight, wake, sleep, water, life
  } = req.body;

  const { email, userId } = req.user;

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    
    const prompt = `You are a hydration planner AI.

      Given the following user details:
      - Birth Date: ${date}
      - Waking Time: ${wake}
      - Sleeping Time: ${sleep}
      - Sex: ${sex} (f for female, m for male and o for others)
      - Lifestyle: ${life} [1 for Sedentary / 2 for Mild Exercise / 3 for Gym Rat]
      - Weight: ${weight} [in kg]
      - Average Water Intake: ${water}[in Litres] 

      Your job is to:
      1. Estimate the user's ideal daily water intake in litres (based on sex, weight, and lifestyle).
      2. Distribute this water intake evenly across the time between waking and sleeping.
      3. Return a schedule of times and water quantities to drink (e.g., "08:00 AM — 250ml").
      4. Make sure water amounts are rounded, human-friendly (like 200ml, 250ml, 300ml).
      5. Do not include times outside the user's awake hours.

      Very Important: Return your response as a **JSON object** and Do NOT wrap it in backticks, do NOT include markdown formatting, and do NOT explain anything. Just output the object as-is in the following format: 
      {
        "waterRequirementLitres": 2.3,
        "reminders": [
          { "label": "Reminder 1", "time": "08:00", "amountML": 250 },
          { "label": "Reminder 2", "time": "10:30", "amountML": 300 }
        ],
        "tip": "Stay hydrated, friend!"
      }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let parsed;
    try {
      parsed = JSON.parse(text);

      const updatedUser = await Users.findOneAndUpdate(
        { email },
        {
          $set: {
            sex,
            date,
            weight,
            sleep,
            wake,
            water,
            life,
            hydrationPlan: parsed,
            hydrationLogs: parsed.reminders.map(r => ({
              label: r.label,
              time: r.time,
              amountML: r.amountML,
              consumed: false
            }))
          }
        },
        { new: true }
      );

      res.json({ hydrationPlan: parsed });

      // 👇 Pass updatedUser.name to avoid undefined in emails
      scheduleReminders({ email, name: updatedUser.name, hydrationPlan: parsed });

    } catch (err) {
      console.error("Failed to parse Gemini response:", err);
      res.status(500).json({ error: "Invalid JSON from Gemini" });
    }

  } catch (err) {
    console.error("Error in generatePlan:", err);
    res.status(500).json({ reply: err.message || err });
  }
};

const displayPlan = async (req, res) => {
  const { email } = req.user;

  try {
    const user = await Users.findOne({ email });
    const hydrationPlan = user.hydrationPlan;
    res.status(200).json(hydrationPlan);
  } catch (err) {
    console.error("displayPlan error:", err);
    res.status(500).json({ message: 'planController error' });
  }
};

module.exports = { generatePlan, displayPlan };
