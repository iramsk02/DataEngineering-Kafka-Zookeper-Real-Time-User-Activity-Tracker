const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");

const kafkaBroker = process.env.KAFKA_BROKER || "localhost:9092";
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/tracker";

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to Mongo:", mongoUrl))
  .catch(err => {
    console.error("Mongo connect error:", err);
    process.exit(1);
  });

const eventSchema = new mongoose.Schema({
  userId: String,
  eventType: String,
  page: String,
  timestamp: Number,
  meta: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

const kafka = new Kafka({ clientId: "activity-consumer", brokers: [kafkaBroker] });
const consumer = kafka.consumer({ groupId: "tracker-group" });

const start = async () => {
  await consumer.connect();
  console.log("Kafka Consumer connected to", kafkaBroker);
  await consumer.subscribe({ topic: "user-events", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        console.log("Consumed event:", event);
        // validate / massage as needed
        await Event.create(event);
      } catch (err) {
        console.error("Error processing message:", err);
      }
    }
  });
};

start().catch(err => {
  console.error("Consumer error:", err);
  process.exit(1);
});
