// const connectDB = require("../config/db");
// const { ObjectId } = require("mongodb");

// exports.createTuition = async (req, res) => {
//  const db = await connectDB();
//  const tuitionsCollection = db.collection("tuitions");

//  const result = await tuitionsCollection.insertOne({
//   ...req.body,
//   status: "Pending",
//   createdAt: new Date(),
//  });

//  res.send(result);
// };

// exports.getApprovedTuitions = async (req, res) => {
//  const db = await connectDB();
//  const tuitionsCollection = db.collection("tuitions");

//  const result = await tuitionsCollection
//   .find({ status: "Approved" })
//   .sort({ createdAt: -1 })
//   .toArray();

//  res.send(result);
// };

// exports.updateTuition = async (req, res) => {
//  const db = await connectDB();
//  const tuitionsCollection = db.collection("tuitions");

//  const id = req.params.id;

//  const result = await tuitionsCollection.updateOne(
//   { _id: new ObjectId(id), studentEmail: req.user.email },
//   { $set: { ...req.body, status: "Pending", updatedAt: new Date() } }
//  );

//  res.send(result);
// };


const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

// create tuition
exports.createTuition = async (req, res) => {
  try {
    const db = await connectDB();
    const tuitionsCollection = db.collection("tuitions");

    const result = await tuitionsCollection.insertOne({
      ...req.body,
      status: "Pending",
      createdAt: new Date(),
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to create tuition" });
  }
};


// get approved tuitions (public)
exports.getApprovedTuitions = async (req, res) => {
  try {
    const db = await connectDB();
    const tuitionsCollection = db.collection("tuitions");

    const result = await tuitionsCollection
      .find({ status: "Approved" })
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch tuitions" });
  }
};


// update tuition (student)
exports.updateTuition = async (req, res) => {
  try {
    const db = await connectDB();
    const tuitionsCollection = db.collection("tuitions");

    const id = req.params.id;

    const result = await tuitionsCollection.updateOne(
      { _id: new ObjectId(id), studentEmail: req.user.email },
      { $set: { ...req.body, status: "Pending", updatedAt: new Date() } }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update tuition" });
  }
};


// student → my tuitions
exports.getMyTuitions = async (req, res) => {
  try {
    const db = await connectDB();
    const tuitionsCollection = db.collection("tuitions");

    const result = await tuitionsCollection
      .find({ studentEmail: req.params.email })
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch my tuitions" });
  }
};


// admin → all tuitions
exports.getAllTuitions = async (req, res) => {
  try {
    const db = await connectDB();
    const tuitionsCollection = db.collection("tuitions");

    const result = await tuitionsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch all tuitions" });
  }
};


// admin → approve / reject tuition
exports.updateTuitionStatus = async (req, res) => {
  try {
    const db = await connectDB();
    const tuitionsCollection = db.collection("tuitions");

    const result = await tuitionsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: req.body.status } }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update status" });
  }
};