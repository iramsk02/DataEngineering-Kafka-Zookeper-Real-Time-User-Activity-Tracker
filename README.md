
# Real-Time User Activity Tracker

🌟 **Overview**
This project implements a complete, containerized, real-time data pipeline for tracking and visualizing user activity (e.g., clicks, page views, session data) on a website. It leverages core Data Engineering technologies like **Kafka**  to ensure highly available, fault-tolerant, and scalable data ingestion.

The system uses an event-driven architecture to instantly stream user events from the frontend, through Kafka, to a backend consumer for processing and real-time visualization.

---

## ✨ Features

* **Real-Time Event Capture**: Captures user interactions (clicks, page loads, etc.) directly from the browser.
* **Asynchronous Data Ingestion**: Uses **Apache Kafka** as a message broker to decouple frontend event generation from backend processing.
* **Scalable Streaming Platform**: Implements a Kafka cluster managed by **ZooKeeper**.
* **Containerized Environment**: Uses **Docker** and **Docker Compose** for easy, one-command setup.
* **Real-Time Dashboard**: Frontend updates instantly as new events are consumed and pushed via WebSockets.

---

## ⚙️ Architecture

The system follows an **event-driven architecture** composed of:

### 1. Frontend (Client)

A simple React web page that registers user activities as JSON events with a Dashboard.

### 2. Backend Producer (Node.js)

A Node.js API endpoint that receives events from the frontend and pushes them into a Kafka topic (e.g., `user_activity`).

### 3. Apache Kafka 

* **Kafka**: Distributed log for storing event streams.

### 4. Backend Consumer (Node.js)

A Node.js service that consumes messages from Kafka, processes them, and sends updates to the frontend dashboard through WebSockets.

---

## 🛠️ Tech Stack

| Component          | Technology             | Role                                  |
| ------------------ | ---------------------- | ------------------------------------- |
| Streaming Platform | Apache Kafka           | Reliable high-throughput event stream |
| Containerization   | Docker, Docker Compose | Deploy all services                   |
| Backend            | Node.js                | Kafka Producer & Consumer             |
| Frontend           | React                  | Event generation & dashboard          |

---

## 🚀 How to Run the Application

This project is fully containerised with Docker.

### **Prerequisites**

* **Docker Desktop**
* **Git**

---

### **Step-by-Step Instructions**

#### 1. Clone the Repository

```bash
git clone https://github.com/iramsk02/DataEngineering-Kafka-Real-Time-User-Activity-Tracker.git
cd DataEngineering-Kafka-Zookeper-Real-Time-User-Activity-Tracker
cd Backend
```

#### 2. Start the Services

Build and start all services:

```bash
docker-compose up --build -d
```

Wait a few moments for Kafka and ZooKeeper to initialise.

#### 3. Access the Application

Open your browser:

* **Frontend User Activity Page:**
```bash
cd DataEngineering-Kafka-Real-Time-User-Activity-Tracker
cd Backend
```
```bash
npm run dev
```
  [http://localhost:5173](http://localhost:5173)

#### 4. Verify Data Flow

* Interact with the frontend (click buttons, navigate).
* Check Producer logs: messages should be sent to Kafka.
* Check Consumer logs: events should be processed in real time.
* Frontend dashboard should update instantly.
* [http://localhost:5173/dashboard](http://localhost:5173/dashboard)

---

### **Stop All Services**

```bash
docker-compose down
```

---
