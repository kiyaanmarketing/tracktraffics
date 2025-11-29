const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("MongoDB Atlas se connect hogaya!");

        // ================================
    // 🔥 TTL Index Auto Create
    // ================================

    // theviewpalm ke liye 24hr TTL
    await db.collection("theviewpalm").createIndex(
      { timestamp: 1 },
      { expireAfterSeconds: 86400 }
    );
    console.log("TTL Index created for theviewpalm (24 hours)");

    // mysteriumvpn ke liye 24hr TTL (optional)
    await db.collection("Payloads").createIndex(
      { timestamp: 1 },
      { expireAfterSeconds: 86400 }
    );
    console.log("TTL Index created for Payloads (24 hours)");

  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };