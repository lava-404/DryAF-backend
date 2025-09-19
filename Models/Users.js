const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sex: String,
  date: Date,
  weight: Number,
  sleep: String,
  wake: String,
  water: Number,
  life: String,
  hydrationPlan: {
    waterRequirement: Number,
    reminders: [{
      label: String,
      time: String, 
      amountML: Number
    }
    ],
    tip: String
  },
  hydrationLogs: [
    {
      date: {
        type: String,
        required: true
      },
      reminders: [
        {
          time: String,
          amountML: Number,
          status: {
            type: String,
            enum: ['completed', 'skipped', 'pending'],
            default: 'pending'
          }
        }
      ]
    }
  ]
})

module.exports = mongoose.model("Users", UsersSchema)