const connectDB = require("../config/db");

exports.getAdminAnalytics = async (req, res) => {
  try {
    const db = await connectDB();

    const paymentsCollection = db.collection("payments");
    const usersCollection = db.collection("users");
    const tuitionsCollection = db.collection("tuitions");

    const payments = await paymentsCollection.find().sort({ date: -1 }).toArray();

    const totalEarnings = payments.reduce((sum, payment) => sum + (payment.salary || 0), 0);

    const totalUsers = await usersCollection.countDocuments();
    const totalTuitions = await tuitionsCollection.countDocuments();

    const successfulPayments = payments.length;

    res.send({
      totalEarnings,
      successfulPayments,
      totalUsers,
      totalTuitions,
      transactionHistory: payments,
    });

  } catch (err) {
    res.status(500).send({ message: "Failed to fetch analytics" });
  }
};