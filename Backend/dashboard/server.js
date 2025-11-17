const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());

mongoose.connect("mongodb://mongo:27017/tracker");

const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    userId: String,
    eventType: String,
    page: String,
    timestamp: Number
  })
);

// 🔹 API #1: Get all events
app.get("/events", async (req, res) => {
  // Increased limit for a better data view
  const events = await Event.find().sort({ timestamp: -1 }).limit(200); 
  res.json(events);
});

// 🔹 API #2: Page views per page
app.get("/page-views", async (req, res) => {
  const stats = await Event.aggregate([
    { $group: { _id: "$page", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.json(stats);
});

// 🔹 API #3: Activity events per minute
app.get("/activity-minutes", async (req, res) => {
  const stats = await Event.aggregate([
    {
      $group: {
        _id: {
          minute: { $minute: { $toDate: "$timestamp" } },
          hour: { $hour: { $toDate: "$timestamp" } },
          day: { $dayOfMonth: { $toDate: "$timestamp" } }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.day": 1, "_id.hour": 1, "_id.minute": 1 } }
  ]);
  res.json(stats);
});

// 🔹 API #4: Active users (last 10 mins)
app.get("/active-users", async (req, res) => {
  const active = await Event.aggregate([
    { 
      $match: { timestamp: { $gte: Date.now() - 10 * 60 * 1000 } } 
    },
    { $group: { _id: "$userId" } }
  ]);
  res.json({ activeUsers: active.length });
});
// 🔹 API #5: Event types count
app.get("/event-types", async (req, res) => {
  const stats = await Event.aggregate([
    { $group: { _id: "$eventType", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.json(stats);
});
app.listen(5000, () => console.log("Dashboard API running on port 5000"));
