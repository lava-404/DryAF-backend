const express = require('express');
const authRoute = require('./routes/authRoute');
const cors = require('cors');
const generatePlanRoute = require("./routes/generatePlanRoute");
const planRoute = require("./routes/planRoute");
const mailRoute = require("./routes/mailRoute");
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ✅ CORS FIX
/*const originOk = (origin) => {
  if (!origin) return true;
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return true;
  if (/^https?:\/\/.*\.builder\.io$/.test(origin)) return true;
  return false;
};
app.use(cors({
  origin: (origin, callback) => {
    if (originOk(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  optionsSuccessStatus: 204
}));*/


const allowedOrigins = [
  "http://localhost:5173",             // local dev
  "https://dry-af.vercel.app",         // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// ✅ Preflight handled by CORS middleware above (Express 5 route parser dislikes "*")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection failed:', err));

// ✅ Routes
app.get('/', (req, res) => {
  res.send("home");
});

app.use('/auth', authRoute);
app.use('/generate-plan', generatePlanRoute);
app.use('/plan', planRoute);
app.use('/send-reminder', mailRoute);
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

app.listen(5667, () => {
  console.log("✅ Server listening on port 5667");
});


