// // const express = require("express");
// // const router = express.Router();

// // const verifyToken = require("../middleware/verifyToken");
// // const verifyAdmin = require("../middleware/verifyAdmin");

// // const { getAdminAnalytics } = require("../controllers/adminController");

// // router.get("/admin/analytics", verifyToken, verifyAdmin, getAdminAnalytics);

// // module.exports = router;

// const express = require("express");
// const verifyToken = require("../middleware/verifyToken");
// const verifyAdmin = require("../middleware/verifyAdmin");
// const connectDB = require("../config/db");

// const router = express.Router();

// router.get("/admin/analytics", verifyToken, verifyAdmin, async (req, res) => {

//  const db = await connectDB();

//  const usersCollection = db.collection("users");
//  const tuitionsCollection = db.collection("tuitions");
//  const paymentsCollection = db.collection("payments");

//  const payments = await paymentsCollection.find().toArray();

//  const totalEarnings = payments.reduce((sum, p) => sum + (p.salary || 0), 0);

//  const totalUsers = await usersCollection.countDocuments();
//  const totalTuitions = await tuitionsCollection.countDocuments();

//  res.send({
//   totalEarnings,
//   totalUsers,
//   totalTuitions,
//   successfulPayments: payments.length,
//   transactionHistory: payments
//  });

// });

// module.exports = router;

const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const connectDB = require("../config/db");

const router = express.Router();

router.get("/admin/analytics", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = await connectDB();

    const usersCollection = db.collection("users");
    const tuitionsCollection = db.collection("tuitions");
    const paymentsCollection = db.collection("payments");

    const payments = await paymentsCollection.find().sort({ date: -1 }).toArray();

    const totalEarnings = payments.reduce(
      (sum, payment) => sum + (parseFloat(payment.salary) || 0),
      0
    );

    const totalUsers = await usersCollection.countDocuments();
    const totalTuitions = await tuitionsCollection.countDocuments();

    res.send({
      totalEarnings,
      totalUsers,
      totalTuitions,
      successfulPayments: payments.length,
      transactionHistory: payments,
    });
  } catch (err) {
    res.status(500).send({ message: "Failed to fetch analytics" });
  }
});

module.exports = router;