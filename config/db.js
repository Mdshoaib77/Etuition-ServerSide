// const { MongoClient, ServerApiVersion } = require("mongodb");

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`;

// const client = new MongoClient(uri, {
//  serverApi: {
//   version: ServerApiVersion.v1,
//   strict: true,
//   deprecationErrors: true,
//  },
// });

// let db;

// async function connectDB() {
//  if (!db) {
//   await client.connect();
//   db = client.db("eTuitionDB");
//   console.log("✅ MongoDB Connected");
//  }
//  return db;
// }

// module.exports = connectDB;



const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`;

if (!process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_CLUSTER) {
  console.error("❌ MongoDB environment variables missing");
}

const client = new MongoClient(uri, {
 serverApi: {
  version: ServerApiVersion.v1,
  strict: true,
  deprecationErrors: true,
 },
});

let db;

async function connectDB() {
 try {
  if (!db) {
   await client.connect();
   db = client.db("eTuitionDB");
   console.log("✅ MongoDB Connected");
  }
  return db;
 } catch (error) {
  console.error("❌ MongoDB Connection Failed:", error);
  throw error;
 }
}

module.exports = connectDB;
