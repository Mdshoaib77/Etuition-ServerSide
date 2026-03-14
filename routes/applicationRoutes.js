// // // // const express = require("express");
// // // // const router = express.Router();

// // // // const verifyToken = require("../middleware/verifyToken");

// // // // const connectDB = require("../config/db");
// // // // const { ObjectId } = require("mongodb");

// // // // // apply for tuition
// // // // router.post("/applications", verifyToken, async (req, res) => {
// // // //   const db = await connectDB();
// // // //   const applicationsCollection = db.collection("applications");

// // // //   const application = req.body;

// // // //   const alreadyApplied = await applicationsCollection.findOne({
// // // //     tuitionId: application.tuitionId,
// // // //     tutorEmail: application.tutorEmail,
// // // //   });

// // // //   if (alreadyApplied) {
// // // //     return res.status(400).send({ message: "You already applied!" });
// // // //   }

// // // //   const result = await applicationsCollection.insertOne({
// // // //     ...application,
// // // //     status: "pending",
// // // //     appliedAt: new Date(),
// // // //   });

// // // //   res.send(result);
// // // // });

// // // // // student applied tutors
// // // // router.get("/student/applied-tutors/:email", verifyToken, async (req, res) => {

// // // //   const db = await connectDB();
// // // //   const applicationsCollection = db.collection("applications");

// // // //   const result = await applicationsCollection
// // // //     .find({ studentEmail: req.params.email })
// // // //     .toArray();

// // // //   res.send(result);
// // // // });

// // // // // tutor applications
// // // // router.get("/tutor/my-applications/:email", verifyToken, async (req, res) => {

// // // //   const db = await connectDB();
// // // //   const applicationsCollection = db.collection("applications");

// // // //   const result = await applicationsCollection
// // // //     .find({ tutorEmail: req.params.email })
// // // //     .toArray();

// // // //   res.send(result);
// // // // });

// // // // // update status
// // // // router.patch("/applications/status/:id", verifyToken, async (req, res) => {

// // // //   const db = await connectDB();
// // // //   const applicationsCollection = db.collection("applications");

// // // //   const result = await applicationsCollection.updateOne(
// // // //     { _id: new ObjectId(req.params.id) },
// // // //     { $set: { status: req.body.status } }
// // // //   );

// // // //   res.send(result);
// // // // });

// // // // module.exports = router;

// // // const express = require("express");
// // // const verifyToken = require("../middleware/verifyToken");
// // // const connectDB = require("../config/db");

// // // const router = express.Router();

// // // router.post("/applications", verifyToken, async (req, res) => {

// // //  const db = await connectDB();
// // //  const applicationsCollection = db.collection("applications");

// // //  const application = req.body;

// // //  const alreadyApplied = await applicationsCollection.findOne({
// // //   tuitionId: application.tuitionId,
// // //   tutorEmail: application.tutorEmail
// // //  });

// // //  if (alreadyApplied) {
// // //   return res.status(400).send({ message: "You already applied!" });
// // //  }

// // //  const result = await applicationsCollection.insertOne({
// // //   ...application,
// // //   status: "pending",
// // //   appliedAt: new Date()
// // //  });

// // //  res.send(result);

// // // });

// // // module.exports = router;



// // const express = require("express");
// // const verifyToken = require("../middleware/verifyToken");
// // const connectDB = require("../config/db");

// // const router = express.Router();


// // // APPLY FOR TUITION
// // router.post("/applications", verifyToken, async (req, res) => {

// //   const db = await connectDB();
// //   const applicationsCollection = db.collection("applications");

// //   const application = req.body;

// //   // duplicate check
// //   const alreadyApplied = await applicationsCollection.findOne({
// //     tuitionId: application.tuitionId,
// //     tutorEmail: application.tutorEmail
// //   });

// //   if (alreadyApplied) {
// //     return res.status(400).send({ message: "You already applied!" });
// //   }

// //   const result = await applicationsCollection.insertOne({
// //     ...application,
// //     status: "pending",
// //     appliedAt: new Date()
// //   });

// //   res.send(result);
// // });



// // // STUDENT → SEE APPLIED TUTORS
// // router.get("/student/applied-tutors/:email", verifyToken, async (req, res) => {

// //   const db = await connectDB();
// //   const applicationsCollection = db.collection("applications");

// //   const email = req.params.email;

// //   const result = await applicationsCollection
// //     .find({ studentEmail: email })
// //     .sort({ appliedAt: -1 })
// //     .toArray();

// //   res.send(result);
// // });



// // module.exports = router;

// const express = require("express");
// const verifyToken = require("../middleware/verifyToken");
// const connectDB = require("../config/db");

// const router = express.Router();


// // APPLY FOR TUITION (ONLY TUTOR)
// router.post("/applications", verifyToken, async (req, res) => {

//   try {

//     const db = await connectDB();

//     const usersCollection = db.collection("users");
//     const applicationsCollection = db.collection("applications");

//     const application = req.body;

//     const email = req.user?.email;

//     // 🔒 Role check
//     const user = await usersCollection.findOne({ email });

//     if (!user || user.role !== "tutor") {
//       return res.status(403).send({
//         message: "Only tutors can apply for tuitions"
//       });
//     }

//     // ❌ duplicate apply check
//     const alreadyApplied = await applicationsCollection.findOne({
//       tuitionId: application.tuitionId,
//       tutorEmail: application.tutorEmail
//     });

//     if (alreadyApplied) {
//       return res.status(400).send({
//         message: "You already applied!"
//       });
//     }

//     // ✅ save application
//     const result = await applicationsCollection.insertOne({
//       ...application,
//       status: "pending",
//       appliedAt: new Date()
//     });

//     res.send(result);

//   } catch (error) {

//     res.status(500).send({
//       message: "Failed to apply",
//       error: error.message
//     });

//   }

// });



// // STUDENT → SEE APPLIED TUTORS
// router.get("/student/applied-tutors/:email", verifyToken, async (req, res) => {

//   try {

//     const db = await connectDB();

//     const applicationsCollection = db.collection("applications");

//     const email = req.params.email;

//     // 🔒 user only own data
//     if (email !== req.user.email) {
//       return res.status(403).send({ message: "Forbidden" });
//     }

//     const result = await applicationsCollection
//       .find({ studentEmail: email })
//       .sort({ appliedAt: -1 })
//       .toArray();

//     res.send(result);

//   } catch (error) {

//     res.status(500).send({
//       message: "Failed to load applications"
//     });

//   }

// });


// module.exports = router;


// const express = require("express");
// const verifyToken = require("../middleware/verifyToken");
// const connectDB = require("../config/db");
// const { ObjectId } = require("mongodb");

// const router = express.Router();

// // APPLY FOR TUITION
// router.post("/applications", verifyToken, async (req, res) => {
//   try {
//     const db = await connectDB();

//     const usersCollection = db.collection("users");
//     const applicationsCollection = db.collection("applications");

//     const application = req.body;

//     // only tutor can apply
//     const loggedUser = await usersCollection.findOne({ email: req.user?.email });

//     if (!loggedUser || loggedUser.role !== "tutor") {
//       return res.status(403).send({ message: "Only tutors can apply!" });
//     }

//     const alreadyApplied = await applicationsCollection.findOne({
//       tuitionId: application.tuitionId,
//       tutorEmail: application.tutorEmail,
//     });

//     if (alreadyApplied) {
//       return res.status(400).send({ message: "You already applied!" });
//     }

//     const result = await applicationsCollection.insertOne({
//       ...application,
//       status: "pending",
//       appliedAt: new Date(),
//     });

//     res.send(result);
//   } catch (err) {
//     res.status(500).send({ message: "Failed to apply" });
//   }
// });

// // STUDENT → SEE APPLIED TUTORS
// router.get("/student/applied-tutors/:email", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const applicationsCollection = db.collection("applications");

//   const result = await applicationsCollection
//     .find({ studentEmail: req.params.email })
//     .sort({ appliedAt: -1 })
//     .toArray();

//   res.send(result);
// });

// // UPDATE APPLICATION STATUS
// router.patch("/applications/status/:id", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const applicationsCollection = db.collection("applications");

//   const result = await applicationsCollection.updateOne(
//     { _id: new ObjectId(req.params.id) },
//     { $set: { status: req.body.status } }
//   );

//   res.send(result);
// });

// // TUTOR → MY APPLICATIONS
// router.get("/tutor/my-applications/:email", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const applicationsCollection = db.collection("applications");

//   const result = await applicationsCollection
//     .find({ tutorEmail: req.params.email })
//     .sort({ appliedAt: -1 })
//     .toArray();

//   res.send(result);
// });

// // ONGOING TUITIONS
// router.get("/ongoing-tuitions/:email", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const applicationsCollection = db.collection("applications");

//   const email = req.params.email;

//   const result = await applicationsCollection
//     .find({
//       tutorEmail: email,
//       status: "Approved",
//       paid: true,
//     })
//     .sort({ appliedAt: -1 })
//     .toArray();

//   res.send(result);
// });

// // SPECIAL ROUTE: APPROVE AFTER PAYMENT
// router.patch("/applications/approve-after-payment/:id", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const applicationsCollection = db.collection("applications");
//   const tuitionsCollection = db.collection("tuitions");

//   const appId = req.params.id;
//   const { tuitionId } = req.body;

//   try {
//     const updateApp = await applicationsCollection.updateOne(
//       { _id: new ObjectId(appId) },
//       { $set: { status: "Approved", paid: true } }
//     );

//     await applicationsCollection.updateMany(
//       {
//         tuitionId: tuitionId,
//         _id: { $ne: new ObjectId(appId) },
//         status: "pending",
//       },
//       { $set: { status: "Rejected" } }
//     );

//     await tuitionsCollection.updateOne(
//       { _id: new ObjectId(tuitionId) },
//       { $set: { status: "Booked" } }
//     );

//     res.send(updateApp);
//   } catch (err) {
//     res.status(500).send({ message: "Failed to finalize approval" });
//   }
// });

// module.exports = router;


// const express = require("express");
// const verifyToken = require("../middleware/verifyToken");
// const connectDB = require("../config/db");
// const { ObjectId } = require("mongodb");

// const router = express.Router();

// // APPLY FOR TUITION
// router.post("/applications", verifyToken, async (req, res) => {
//   try {
//     const db = await connectDB();

//     const usersCollection = db.collection("users");
//     const applicationsCollection = db.collection("applications");

//     const application = req.body;

//     // only tutor can apply
//     const loggedUser = await usersCollection.findOne({ email: req.user?.email });

//     if (!loggedUser || loggedUser.role !== "tutor") {
//       return res.status(403).send({ message: "Only tutors can apply!" });
//     }

//     const alreadyApplied = await applicationsCollection.findOne({
//       tuitionId: application.tuitionId,
//       tutorEmail: application.tutorEmail,
//     });

//     if (alreadyApplied) {
//       return res.status(400).send({ message: "You already applied!" });
//     }

//     const result = await applicationsCollection.insertOne({
//       ...application,
//       status: "pending",
//       appliedAt: new Date(),
//     });

//     res.send(result);
//   } catch (err) {
//     res.status(500).send({ message: "Failed to apply" });
//   }
// });

// // STUDENT → SEE APPLIED TUTORS
// router.get("/student/applied-tutors/:email", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const applicationsCollection = db.collection("applications");

//   const result = await applicationsCollection
//     .find({ studentEmail: req.params.email })
//     .sort({ appliedAt: -1 })
//     .toArray();

//   res.send(result);
// });

// // UPDATE APPLICATION STATUS
// router.patch("/applications/status/:id", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const applicationsCollection = db.collection("applications");

//   const result = await applicationsCollection.updateOne(
//     { _id: new ObjectId(req.params.id) },
//     { $set: { status: req.body.status } }
//   );

//   res.send(result);
// });

// // TUTOR → MY APPLICATIONS
// router.get("/tutor/my-applications/:email", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const applicationsCollection = db.collection("applications");

//   const result = await applicationsCollection
//     .find({ tutorEmail: req.params.email })
//     .sort({ appliedAt: -1 })
//     .toArray();

//   res.send(result);
// });

// // ONGOING TUITIONS
// router.get("/ongoing-tuitions/:email", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const applicationsCollection = db.collection("applications");

//   const email = req.params.email;

//   const result = await applicationsCollection
//     .find({
//       tutorEmail: email,
//       status: "Approved",
//       paid: true,
//     })
//     .sort({ appliedAt: -1 })
//     .toArray();

//   res.send(result);
// });

// /* -----------------------------
//    NEW ROUTE → TUTOR APPLICATIONS
//    (for CancelApplication page)
// --------------------------------*/
// router.get("/applications/tutor/:email", verifyToken, async (req, res) => {

//   const db = await connectDB();
//   const applicationsCollection = db.collection("applications");

//   const result = await applicationsCollection
//     .find({ tutorEmail: req.params.email })
//     .sort({ appliedAt: -1 })
//     .toArray();

//   res.send(result || []);

// });

// /* -----------------------------
//    NEW ROUTE → CANCEL APPLICATION
// --------------------------------*/
// router.delete("/applications/:id", verifyToken, async (req, res) => {

//   const db = await connectDB();
//   const applicationsCollection = db.collection("applications");

//   const result = await applicationsCollection.deleteOne({
//     _id: new ObjectId(req.params.id),
//   });

//   res.send(result);

// });

// // SPECIAL ROUTE: APPROVE AFTER PAYMENT
// router.patch("/applications/approve-after-payment/:id", verifyToken, async (req, res) => {
//   const db = await connectDB();
//   const applicationsCollection = db.collection("applications");
//   const tuitionsCollection = db.collection("tuitions");

//   const appId = req.params.id;
//   const { tuitionId } = req.body;

//   try {
//     const updateApp = await applicationsCollection.updateOne(
//       { _id: new ObjectId(appId) },
//       { $set: { status: "Approved", paid: true } }
//     );

//     await applicationsCollection.updateMany(
//       {
//         tuitionId: tuitionId,
//         _id: { $ne: new ObjectId(appId) },
//         status: "pending",
//       },
//       { $set: { status: "Rejected" } }
//     );

//     await tuitionsCollection.updateOne(
//       { _id: new ObjectId(tuitionId) },
//       { $set: { status: "Booked" } }
//     );

//     res.send(updateApp);
//   } catch (err) {
//     res.status(500).send({ message: "Failed to finalize approval" });
//   }
// });

// module.exports = router;


const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

const router = express.Router();

// APPLY FOR TUITION
router.post("/applications", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();

    const usersCollection = db.collection("users");
    const applicationsCollection = db.collection("applications");

    const application = req.body;

    // only tutor can apply
    const loggedUser = await usersCollection.findOne({ email: req.user?.email });

    if (!loggedUser || loggedUser.role !== "tutor") {
      return res.status(403).send({ message: "Only tutors can apply!" });
    }

    const alreadyApplied = await applicationsCollection.findOne({
      tuitionId: application.tuitionId,
      tutorEmail: application.tutorEmail,
    });

    if (alreadyApplied) {
      return res.status(400).send({ message: "You already applied!" });
    }

    const result = await applicationsCollection.insertOne({
      ...application,
      status: "pending",
      appliedAt: new Date(),
    });

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Failed to apply" });
  }
});

// STUDENT → SEE APPLIED TUTORS
router.get("/student/applied-tutors/:email", verifyToken, async (req, res) => {
  const db = await connectDB();
  const applicationsCollection = db.collection("applications");

  const result = await applicationsCollection
    .find({ studentEmail: req.params.email })
    .sort({ appliedAt: -1 })
    .toArray();

  res.send(result);
});

// UPDATE APPLICATION STATUS
router.patch("/applications/status/:id", verifyToken, async (req, res) => {
  const db = await connectDB();
  const applicationsCollection = db.collection("applications");

  const result = await applicationsCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { status: req.body.status } }
  );

  res.send(result);
});

// TUTOR → MY APPLICATIONS
router.get("/tutor/my-applications/:email", verifyToken, async (req, res) => {
  const db = await connectDB();
  const applicationsCollection = db.collection("applications");

  const result = await applicationsCollection
    .find({ tutorEmail: req.params.email })
    .sort({ appliedAt: -1 })
    .toArray();

  res.send(result);
});

// ONGOING TUITIONS
router.get("/ongoing-tuitions/:email", verifyToken, async (req, res) => {
  const db = await connectDB();
  const applicationsCollection = db.collection("applications");

  const email = req.params.email;

  const result = await applicationsCollection
    .find({
      tutorEmail: email,
      status: "Approved",
      paid: true,
    })
    .sort({ appliedAt: -1 })
    .toArray();

  res.send(result);
});

/* -----------------------------
   COMPLETED TUITIONS (NEW)
--------------------------------*/
router.get("/tutor/completed-tuitions/:email", verifyToken, async (req, res) => {

  const db = await connectDB();
  const applicationsCollection = db.collection("applications");

  const result = await applicationsCollection
    .find({
      tutorEmail: req.params.email,
      status: "Completed"
    })
    .sort({ appliedAt: -1 })
    .toArray();

  res.send(result || []);

});

/* -----------------------------
   MARK TUITION AS COMPLETED
--------------------------------*/
router.patch("/applications/complete/:id", verifyToken, async (req, res) => {

  const db = await connectDB();
  const applicationsCollection = db.collection("applications");

  const result = await applicationsCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { status: "Completed" } }
  );

  res.send(result);

});

/* -----------------------------
   TUTOR APPLICATIONS
--------------------------------*/
router.get("/applications/tutor/:email", verifyToken, async (req, res) => {

  const db = await connectDB();
  const applicationsCollection = db.collection("applications");

  const result = await applicationsCollection
    .find({ tutorEmail: req.params.email })
    .sort({ appliedAt: -1 })
    .toArray();

  res.send(result || []);

});

/* -----------------------------
   CANCEL APPLICATION
--------------------------------*/
router.delete("/applications/:id", verifyToken, async (req, res) => {

  const db = await connectDB();
  const applicationsCollection = db.collection("applications");

  const result = await applicationsCollection.deleteOne({
    _id: new ObjectId(req.params.id),
  });

  res.send(result);

});

// SPECIAL ROUTE: APPROVE AFTER PAYMENT
router.patch("/applications/approve-after-payment/:id", verifyToken, async (req, res) => {
  const db = await connectDB();
  const applicationsCollection = db.collection("applications");
  const tuitionsCollection = db.collection("tuitions");

  const appId = req.params.id;
  const { tuitionId } = req.body;

  try {
    const updateApp = await applicationsCollection.updateOne(
      { _id: new ObjectId(appId) },
      { $set: { status: "Approved", paid: true } }
    );

    await applicationsCollection.updateMany(
      {
        tuitionId: tuitionId,
        _id: { $ne: new ObjectId(appId) },
        status: "pending",
      },
      { $set: { status: "Rejected" } }
    );

    await tuitionsCollection.updateOne(
      { _id: new ObjectId(tuitionId) },
      { $set: { status: "Booked" } }
    );

    res.send(updateApp);
  } catch (err) {
    res.status(500).send({ message: "Failed to finalize approval" });
  }
});

module.exports = router;