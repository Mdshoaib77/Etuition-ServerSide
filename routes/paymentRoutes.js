// const express = require("express");
// const verifyToken = require("../middleware/verifyToken");
// const connectDB = require("../config/db");
// const { ObjectId } = require("mongodb");

// let stripe;
// if (process.env.STRIPE_SECRET) {
//   stripe = require("stripe")(process.env.STRIPE_SECRET);
// }

// const router = express.Router();

// /* -----------------------------
//    CREATE STRIPE CHECKOUT SESSION
// --------------------------------*/
// router.post("/create-checkout-session", verifyToken, async (req, res) => {
//   try {
//     const { application } = req.body;

//     if (!stripe) {
//       return res.status(500).send({ message: "Stripe not initialized" });
//     }

//     const amount = application.expectedSalary || application.salary;
//     const origin = req.headers.origin;

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: application.tuitionTitle,
//               description: `Tutor: ${application.tutorEmail}`,
//             },
//             unit_amount: Math.round(amount * 100),
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${origin}/dashboard/student/payments/success?appId=${application._id}&tuitionId=${application.tuitionId}&tutorEmail=${application.tutorEmail}&amount=${amount}`,
//       cancel_url: `${origin}/dashboard/student/applied-tutors`,
//     });

//     res.send({ url: session.url });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// });

// /* -----------------------------
//    SAVE PAYMENT HISTORY + UPDATE STATUS
// --------------------------------*/
// router.post("/payments", verifyToken, async (req, res) => {
//   try {
//     const db = await connectDB();

//     const paymentsCollection = db.collection("payments");
//     const applicationsCollection = db.collection("applications");
//     const tuitionsCollection = db.collection("tuitions");

//     const payment = req.body;

//     const paymentDoc = {
//       applicationId: payment.applicationId,
//       tuitionId: payment.tuitionId,
//       studentEmail: payment.studentEmail,
//       tutorEmail: payment.tutorEmail,
//       salary: parseFloat(payment.salary),
//       status: "success",
//       date: new Date(),
//     };

//     // 1️⃣ Save payment
//     const result = await paymentsCollection.insertOne(paymentDoc);

//     // 2️⃣ Approve selected application
//     await applicationsCollection.updateOne(
//       { _id: new ObjectId(payment.applicationId) },
//       {
//         $set: {
//           status: "Approved",
//           paid: true,
//         },
//       }
//     );

//     // 3️⃣ Reject other tutors
//     await applicationsCollection.updateMany(
//       {
//         tuitionId: payment.tuitionId,
//         _id: { $ne: new ObjectId(payment.applicationId) },
//       },
//       {
//         $set: { status: "Rejected" },
//       }
//     );

//     // 4️⃣ Mark tuition booked
//     await tuitionsCollection.updateOne(
//       { _id: new ObjectId(payment.tuitionId) },
//       {
//         $set: {
//           status: "Booked",
//           tutorEmail: payment.tutorEmail,
//         },
//       }
//     );

//     res.send(result);
//   } catch (err) {
//     res.status(500).send({ message: "Payment confirmation failed" });
//   }
// });

// /* -----------------------------
//    GET PAYMENT HISTORY (STUDENT)
// --------------------------------*/
// router.get("/payments/:email", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const paymentsCollection = db.collection("payments");

//   const result = await paymentsCollection
//     .find({ studentEmail: req.params.email })
//     .sort({ date: -1 })
//     .toArray();

//   res.send(result || []);
// });

// /* -----------------------------
//    GET TUTOR REVENUE
// --------------------------------*/
// router.get("/tutor-revenue/:email", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const paymentsCollection = db.collection("payments");

//   const email = req.params.email;

//   const payments = await paymentsCollection
//     .find({ tutorEmail: email })
//     .sort({ date: -1 })
//     .toArray();

//   const totalRevenue = payments.reduce(
//     (sum, payment) => sum + (parseFloat(payment.salary) || 0),
//     0
//   );

//   res.send({
//     payments,
//     totalRevenue,
//   });
// });

// module.exports = router;


// const express = require("express");
// const verifyToken = require("../middleware/verifyToken");
// const connectDB = require("../config/db");
// const { ObjectId } = require("mongodb");

// let stripe;
// if (process.env.STRIPE_SECRET) {
//   stripe = require("stripe")(process.env.STRIPE_SECRET);
// }

// const router = express.Router();

// /* -----------------------------
//    CREATE STRIPE CHECKOUT SESSION
// --------------------------------*/
// router.post("/create-checkout-session", verifyToken, async (req, res) => {
//   try {
//     const { application } = req.body;

//     if (!stripe) {
//       return res.status(500).send({ message: "Stripe not initialized" });
//     }

//     const amount = application.expectedSalary || application.salary;
//     const origin = req.headers.origin;

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: application.tuitionTitle,
//               description: `Tutor: ${application.tutorEmail}`,
//             },
//             unit_amount: Math.round(amount * 100),
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${origin}/dashboard/student/payments/success?appId=${application._id}&tuitionId=${application.tuitionId}&tutorEmail=${application.tutorEmail}&amount=${amount}`,
//       cancel_url: `${origin}/dashboard/student/applied-tutors`,
//     });

//     res.send({ url: session.url });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// });

// /* -----------------------------
//    SAVE PAYMENT HISTORY + UPDATE STATUS
// --------------------------------*/
// router.post("/payments", verifyToken, async (req, res) => {
//   try {
//     const db = await connectDB();

//     const paymentsCollection = db.collection("payments");
//     const applicationsCollection = db.collection("applications");
//     const tuitionsCollection = db.collection("tuitions");

//     const payment = req.body;

//     const paymentDoc = {
//       applicationId: payment.applicationId,
//       tuitionId: payment.tuitionId,
//       studentEmail: payment.studentEmail,
//       tutorEmail: payment.tutorEmail,
//       salary: parseFloat(payment.salary),
//       status: "success",
//       date: new Date(),
//     };

//     const result = await paymentsCollection.insertOne(paymentDoc);

//     await applicationsCollection.updateOne(
//       { _id: new ObjectId(payment.applicationId) },
//       {
//         $set: {
//           status: "Approved",
//           paid: true,
//         },
//       }
//     );

//     await applicationsCollection.updateMany(
//       {
//         tuitionId: payment.tuitionId,
//         _id: { $ne: new ObjectId(payment.applicationId) },
//       },
//       {
//         $set: { status: "Rejected" },
//       }
//     );

//     await tuitionsCollection.updateOne(
//       { _id: new ObjectId(payment.tuitionId) },
//       {
//         $set: {
//           status: "Booked",
//           tutorEmail: payment.tutorEmail,
//         },
//       }
//     );

//     res.send(result);
//   } catch (err) {
//     res.status(500).send({ message: "Payment confirmation failed" });
//   }
// });

// /* -----------------------------
//    GET PAYMENT HISTORY (STUDENT)
// --------------------------------*/
// router.get("/payments/:email", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const paymentsCollection = db.collection("payments");

//   const result = await paymentsCollection
//     .find({ studentEmail: req.params.email })
//     .sort({ date: -1 })
//     .toArray();

//   res.send(result || []);
// });

// /* -----------------------------
//    GET TUTOR REVENUE
// --------------------------------*/
// router.get("/tutor-revenue/:email", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const paymentsCollection = db.collection("payments");

//   const email = req.params.email;

//   const payments = await paymentsCollection
//     .find({ tutorEmail: email })
//     .sort({ date: -1 })
//     .toArray();

//   const totalRevenue = payments.reduce(
//     (sum, payment) => sum + (parseFloat(payment.salary) || 0),
//     0
//   );

//   res.send({
//     payments,
//     totalRevenue,
//   });
// });

// module.exports = router;

const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

let stripe;
if (process.env.STRIPE_SECRET) {
  stripe = require("stripe")(process.env.STRIPE_SECRET);
}

const router = express.Router();

/* -----------------------------
   CREATE STRIPE CHECKOUT SESSION
--------------------------------*/
router.post("/create-checkout-session", verifyToken, async (req, res) => {
  try {
    const { application } = req.body;

    if (!stripe) {
      return res.status(500).send({ message: "Stripe not initialized" });
    }

    const amount = application.expectedSalary || application.salary;
    const origin = req.headers.origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: application.tuitionTitle,
              description: `Tutor: ${application.tutorEmail}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      // ✅ ONLY CHANGE HERE (studentEmail added)
      success_url: `${origin}/dashboard/student/payments/success?appId=${application._id}&tuitionId=${application.tuitionId}&tutorEmail=${application.tutorEmail}&amount=${amount}&studentEmail=${req.user.email}`,

      cancel_url: `${origin}/dashboard/student/applied-tutors`,
    });

    res.send({ url: session.url });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

/* -----------------------------
   SAVE PAYMENT HISTORY + UPDATE STATUS
--------------------------------*/
router.post("/payments", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();

    const paymentsCollection = db.collection("payments");
    const applicationsCollection = db.collection("applications");
    const tuitionsCollection = db.collection("tuitions");

    const payment = req.body;

    const paymentDoc = {
      applicationId: payment.applicationId,
      tuitionId: payment.tuitionId,
      studentEmail: payment.studentEmail,
      tutorEmail: payment.tutorEmail,
      salary: parseFloat(payment.salary),
      status: "success",
      date: new Date(),
    };

    const result = await paymentsCollection.insertOne(paymentDoc);

    await applicationsCollection.updateOne(
      { _id: new ObjectId(payment.applicationId) },
      {
        $set: {
          status: "Approved",
          paid: true,
        },
      }
    );

    await applicationsCollection.updateMany(
      {
        tuitionId: payment.tuitionId,
        _id: { $ne: new ObjectId(payment.applicationId) },
      },
      {
        $set: { status: "Rejected" },
      }
    );

    await tuitionsCollection.updateOne(
      { _id: new ObjectId(payment.tuitionId) },
      {
        $set: {
          status: "Booked",
          tutorEmail: payment.tutorEmail,
        },
      }
    );

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Payment confirmation failed" });
  }
});

/* -----------------------------
   GET PAYMENT HISTORY (STUDENT)
--------------------------------*/
router.get("/payments/:email", verifyToken, async (req, res) => {
  const db = await connectDB();
  const paymentsCollection = db.collection("payments");

  const result = await paymentsCollection
    .find({ studentEmail: req.params.email })
    .sort({ date: -1 })
    .toArray();

  res.send(result || []);
});

/* -----------------------------
   GET TUTOR REVENUE
--------------------------------*/
router.get("/tutor-revenue/:email", verifyToken, async (req, res) => {
  const db = await connectDB();
  const paymentsCollection = db.collection("payments");

  const email = req.params.email;

  const payments = await paymentsCollection
    .find({ tutorEmail: email })
    .sort({ date: -1 })
    .toArray();

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + (parseFloat(payment.salary) || 0),
    0
  );

  res.send({
    payments,
    totalRevenue,
  });
});

module.exports = router;