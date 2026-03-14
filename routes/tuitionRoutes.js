// // const express = require("express");
// // const verifyToken = require("../middleware/verifyToken");

// // const {
// //  createTuition,
// //  getApprovedTuitions,
// //  updateTuition,
// // } = require("../controllers/tuitionController");

// // const router = express.Router();

// // router.post("/tuitions", verifyToken, createTuition);
// // router.get("/tuitions", getApprovedTuitions);
// // router.patch("/tuitions/update/:id", verifyToken, updateTuition);

// // module.exports = router;

// const express = require("express");
// const verifyToken = require("../middleware/verifyToken");
// const verifyAdmin = require("../middleware/verifyAdmin");

// const {
//   createTuition,
//   getApprovedTuitions,
//   updateTuition,
//   getMyTuitions,
//   getAllTuitions,
//   updateTuitionStatus,
// } = require("../controllers/tuitionController");

// const router = express.Router();

// // create tuition (student)
// router.post("/tuitions", verifyToken, createTuition);

// // get approved tuitions (public)
// router.get("/tuitions", getApprovedTuitions);

// // update tuition (student)
// router.patch("/tuitions/update/:id", verifyToken, updateTuition);

// // student dashboard → my tuitions
// router.get("/my-tuitions/:email", verifyToken, getMyTuitions);

// // admin dashboard → all tuitions
// router.get("/admin/all-tuitions", verifyToken, verifyAdmin, getAllTuitions);

// // admin approve / reject tuition
// router.patch(
//   "/tuitions/status/:id",
//   verifyToken,
//   verifyAdmin,
//   updateTuitionStatus
// );

// module.exports = router;


const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

const {
  createTuition,
  getApprovedTuitions,
  updateTuition,
  getMyTuitions,
  getAllTuitions,
  updateTuitionStatus,
} = require("../controllers/tuitionController");

const connectDB = require("../config/db"); // ✅ added

const router = express.Router();

// create tuition (student)
router.post("/tuitions", verifyToken, createTuition);

// get approved tuitions (public)
router.get("/tuitions", getApprovedTuitions);

// update tuition (student)
router.patch("/tuitions/update/:id", verifyToken, updateTuition);

// student dashboard → my tuitions
router.get("/my-tuitions/:email", verifyToken, getMyTuitions);

// admin dashboard → all tuitions
router.get("/admin/all-tuitions", verifyToken, verifyAdmin, getAllTuitions);

// admin approve / reject tuition
router.patch(
  "/tuitions/status/:id",
  verifyToken,
  verifyAdmin,
  updateTuitionStatus
);

/* ----------------------------------
   STUDENT ONGOING TUITIONS
----------------------------------- */

router.get("/student-ongoing/:email", verifyToken, async (req, res) => {

  try {

    const db = await connectDB();
    const tuitionsCollection = db.collection("tuitions");

    const result = await tuitionsCollection
      .find({
        studentEmail: req.params.email,
        status: "Booked"
      })
      .toArray();

    res.send(result);

  } catch (error) {

    res.status(500).send({ message: "Failed to load ongoing tuitions" });

  }

});

module.exports = router;