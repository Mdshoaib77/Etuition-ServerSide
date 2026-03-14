const connectDB = require("../config/db");

exports.applyTuition = async (req, res) => {
 const db = await connectDB();
 const applicationsCollection = db.collection("applications");

 const application = req.body;

 const exists = await applicationsCollection.findOne({
  tuitionId: application.tuitionId,
  tutorEmail: application.tutorEmail,
 });

 if (exists) {
  return res.status(400).send({ message: "You already applied!" });
 }

 const result = await applicationsCollection.insertOne({
  ...application,
  status: "pending",
  appliedAt: new Date(),
 });

 res.send(result);
};