const express = require("express");
const { Kafka } = require("kafkajs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const kafkaBroker = process.env.KAFKA_BROKER || "localhost:9092";
const kafka = new Kafka({ clientId: "activity-tracker", brokers: [kafkaBroker] });
const producer = kafka.producer();

const startProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer connected to", kafkaBroker);
};

startProducer().catch(err => {
  console.error("Producer init error:", err);
  process.exit(1);
});

app.post("/events", async (req, res) => {
  const event = req.body;
  if (!event || !event.userId) {
    return res.status(400).send({ error: "Event must include userId" });
  }

  try {
    await producer.send({
      topic: "user-events",
      messages: [{ value: JSON.stringify(event) }],
    });
    return res.send({ status: "Event sent to Kafka" });
  } catch (err) {
    console.error("Send error:", err);
    return res.status(500).send({ error: "Failed to send event" });
  }
});

app.get("/health", (req, res) => res.send({ ok: true }));

const port = 3000;
app.listen(port, () => console.log(`Producer API listening on ${port}`));
