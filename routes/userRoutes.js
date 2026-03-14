// // // const express = require("express");

// // // const {
// // //  createUser,
// // //  generateJWT,
// // //  logout,
// // // } = require("../controllers/userController");

// // // const router = express.Router();

// // // router.post("/users", createUser);
// // // router.post("/jwt", generateJWT);
// // // router.post("/logout", logout);

// // // module.exports = router;


// // const express = require("express");
// // const router = express.Router();

// // const {
// //   createUser,
// //   generateJWT,
// //   logout,
// // } = require("../controllers/userController");

// // const verifyToken = require("../middleware/verifyToken");
// // const connectDB = require("../config/db");

// // // create user
// // router.post("/users", createUser);

// // // login jwt
// // router.post("/jwt", generateJWT);

// // // logout
// // router.post("/logout", logout);

// // // 🔥 ADD THIS ROUTE
// // router.get("/users/role/:email", verifyToken, async (req, res) => {
// //   const db = await connectDB();
// //   const usersCollection = db.collection("users");

// //   const email = req.params.email;

// //   if (email !== req.user.email) {
// //     return res.status(403).send({ message: "Forbidden" });
// //   }

// //   const user = await usersCollection.findOne({ email });

// //   res.send({ role: user?.role || "student" });
// // });

// // module.exports = router;


// // const express = require("express");
// // const router = express.Router();

// // const {
// //   createUser,
// //   generateJWT,
// //   logout,
// // } = require("../controllers/userController");

// // const verifyToken = require("../middleware/verifyToken");
// // const connectDB = require("../config/db");

// // // create user
// // router.post("/users", createUser);

// // // login
// // router.post("/jwt", generateJWT);

// // // logout
// // router.post("/logout", logout);

// // // 🔥 role check (frontend use করে)
// // router.get("/users/role/:email", verifyToken, async (req, res) => {
// //   try {
// //     const db = await connectDB();
// //     const usersCollection = db.collection("users");

// //     const email = req.params.email;

// //     if (email !== req.user.email) {
// //       return res.status(403).send({ message: "Forbidden" });
// //     }

// //     const user = await usersCollection.findOne({ email });

// //     res.send({ role: user?.role || "student" });
// //   } catch (error) {
// //     res.status(500).send({ message: "Failed to get role" });
// //   }
// // });

// // module.exports = router;


// // const express = require("express");
// // const router = express.Router();

// // const {
// //   createUser,
// //   generateJWT,
// //   logout,
// // } = require("../controllers/userController");

// // const verifyToken = require("../middleware/verifyToken");
// // const verifyAdmin = require("../middleware/verifyAdmin");
// // const connectDB = require("../config/db");
// // const { ObjectId } = require("mongodb");

// // // create user
// // router.post("/users", createUser);

// // // login
// // router.post("/jwt", generateJWT);

// // // logout
// // router.post("/logout", logout);

// // // role check
// // router.get("/users/role/:email", verifyToken, async (req, res) => {
// //   try {
// //     const db = await connectDB();
// //     const usersCollection = db.collection("users");

// //     const email = req.params.email;

// //     if (email !== req.user.email) {
// //       return res.status(403).send({ message: "Forbidden" });
// //     }

// //     const user = await usersCollection.findOne({ email });

// //     res.send({ role: user?.role || "student" });
// //   } catch (error) {
// //     res.status(500).send({ message: "Failed to get role" });
// //   }
// // });


// // // 🔥 ADMIN USER MANAGEMENT

// // // get all users
// // router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
// //   const db = await connectDB();
// //   const usersCollection = db.collection("users");

// //   const result = await usersCollection.find().toArray();
// //   res.send(result);
// // });

// // // update role
// // router.patch("/users/role/:id", verifyToken, verifyAdmin, async (req, res) => {
// //   const db = await connectDB();
// //   const usersCollection = db.collection("users");

// //   const id = req.params.id;
// //   const { role } = req.body;

// //   const result = await usersCollection.updateOne(
// //     { _id: new ObjectId(id) },
// //     { $set: { role: role } }
// //   );

// //   res.send(result);
// // });

// // // update user
// // router.patch("/users/update/:id", verifyToken, verifyAdmin, async (req, res) => {
// //   const db = await connectDB();
// //   const usersCollection = db.collection("users");

// //   const id = req.params.id;
// //   const updatedData = req.body;

// //   const result = await usersCollection.updateOne(
// //     { _id: new ObjectId(id) },
// //     {
// //       $set: {
// //         name: updatedData.name,
// //         image: updatedData.image,
// //         status: updatedData.status,
// //         phone: updatedData.phone,
// //       },
// //     }
// //   );

// //   res.send(result);
// // });

// // // delete user
// // router.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
// //   const db = await connectDB();
// //   const usersCollection = db.collection("users");

// //   const result = await usersCollection.deleteOne({
// //     _id: new ObjectId(req.params.id),
// //   });

// //   res.send(result);
// // });


// // // 🔥 USER PROFILE

// // router.get("/user-profile/:email", verifyToken, async (req, res) => {
// //   const db = await connectDB();
// //   const usersCollection = db.collection("users");

// //   const result = await usersCollection.findOne({
// //     email: req.params.email,
// //   });

// //   res.send(result);
// // });

// // router.patch("/user-profile/update/:email", verifyToken, async (req, res) => {
// //   const db = await connectDB();
// //   const usersCollection = db.collection("users");

// //   const result = await usersCollection.updateOne(
// //     { email: req.params.email },
// //     { $set: req.body }
// //   );

// //   res.send(result);
// // });

// // module.exports = router;


// const express = require("express");
// const router = express.Router();

// const {
//   createUser,
//   generateJWT,
//   logout,
// } = require("../controllers/userController");

// const verifyToken = require("../middleware/verifyToken");
// const verifyAdmin = require("../middleware/verifyAdmin");
// const connectDB = require("../config/db");
// const { ObjectId } = require("mongodb");

// // create user
// router.post("/users", createUser);

// // login
// router.post("/jwt", generateJWT);

// // logout
// router.post("/logout", logout);

// // role check
// router.get("/users/role/:email", verifyToken, async (req, res) => {
//   try {
//     const db = await connectDB();
//     const usersCollection = db.collection("users");

//     const email = req.params.email;

//     if (email !== req.user.email) {
//       return res.status(403).send({ message: "Forbidden" });
//     }

//     const user = await usersCollection.findOne({ email });

//     res.send({ role: user?.role || "student" });
//   } catch (error) {
//     res.status(500).send({ message: "Failed to get role" });
//   }
// });


// // 🔥 ADMIN USER MANAGEMENT

// // get all users
// router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
//   try {
//     const db = await connectDB();
//     const usersCollection = db.collection("users");

//     const result = await usersCollection.find().toArray();
//     res.send(result);
//   } catch {
//     res.status(500).send({ message: "Failed to load users" });
//   }
// });

// // update role
// router.patch("/users/role/:id", verifyToken, verifyAdmin, async (req, res) => {
//   try {
//     const db = await connectDB();
//     const usersCollection = db.collection("users");

//     const id = req.params.id;
//     const { role } = req.body;

//     const result = await usersCollection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { role: role } }
//     );

//     res.send(result);
//   } catch {
//     res.status(500).send({ message: "Failed to update role" });
//   }
// });

// // update user
// router.patch("/users/update/:id", verifyToken, verifyAdmin, async (req, res) => {
//   try {
//     const db = await connectDB();
//     const usersCollection = db.collection("users");

//     const id = req.params.id;
//     const updatedData = req.body;

//     const result = await usersCollection.updateOne(
//       { _id: new ObjectId(id) },
//       {
//         $set: {
//           name: updatedData.name,
//           image: updatedData.image,
//           status: updatedData.status,
//           phone: updatedData.phone,
//         },
//       }
//     );

//     res.send(result);
//   } catch {
//     res.status(500).send({ message: "Failed to update user" });
//   }
// });

// // delete user
// router.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
//   try {
//     const db = await connectDB();
//     const usersCollection = db.collection("users");

//     const result = await usersCollection.deleteOne({
//       _id: new ObjectId(req.params.id),
//     });

//     res.send(result);
//   } catch {
//     res.status(500).send({ message: "Failed to delete user" });
//   }
// });


// // 🔥 USER PROFILE

// router.get("/user-profile/:email", verifyToken, async (req, res) => {
//   try {
//     const db = await connectDB();
//     const usersCollection = db.collection("users");

//     if (req.params.email !== req.user.email) {
//       return res.status(403).send({ message: "Forbidden access" });
//     }

//     const result = await usersCollection.findOne({
//       email: req.params.email,
//     });

//     res.send(result);
//   } catch {
//     res.status(500).send({ message: "Failed to load profile" });
//   }
// });

// router.patch("/user-profile/update/:email", verifyToken, async (req, res) => {
//   try {
//     const db = await connectDB();
//     const usersCollection = db.collection("users");

//     if (req.params.email !== req.user.email) {
//       return res.status(403).send({ message: "Forbidden access" });
//     }

//     const result = await usersCollection.updateOne(
//       { email: req.params.email },
//       { $set: req.body }
//     );

//     res.send(result);
//   } catch {
//     res.status(500).send({ message: "Failed to update profile" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  createUser,
  generateJWT,
  logout,
} = require("../controllers/userController");

const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

// create user
router.post("/users", createUser);

// login
router.post("/jwt", generateJWT);

// logout
router.post("/logout", logout);

// role check
router.get("/users/role/:email", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");

    const email = req.params.email;

    if (email !== req.user.email) {
      return res.status(403).send({ message: "Forbidden" });
    }

    const user = await usersCollection.findOne({ email });

    res.send({ role: user?.role || "student" });
  } catch (error) {
    res.status(500).send({ message: "Failed to get role" });
  }
});


// 🔥 ADMIN USER MANAGEMENT

// get all users
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");

    const result = await usersCollection.find().toArray();
    res.send(result);
  } catch {
    res.status(500).send({ message: "Failed to load users" });
  }
});

// update role
router.patch("/users/role/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");

    const id = req.params.id;
    const { role } = req.body;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role: role } }
    );

    res.send(result);
  } catch {
    res.status(500).send({ message: "Failed to update role" });
  }
});

// update user
router.patch("/users/update/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");

    const id = req.params.id;
    const updatedData = req.body;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: updatedData.name,
          image: updatedData.image,
          status: updatedData.status,
          phone: updatedData.phone,
        },
      }
    );

    res.send(result);
  } catch {
    res.status(500).send({ message: "Failed to update user" });
  }
});

// delete user
router.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    res.send(result);
  } catch {
    res.status(500).send({ message: "Failed to delete user" });
  }
});


// 🔥 USER PROFILE

router.get("/user-profile/:email", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");

    if (req.params.email !== req.user.email) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    const result = await usersCollection.findOne({
      email: req.params.email,
    });

    res.send(result);
  } catch {
    res.status(500).send({ message: "Failed to load profile" });
  }
});

router.patch("/user-profile/update/:email", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");

    if (req.params.email !== req.user.email) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    const result = await usersCollection.updateOne(
      { email: req.params.email },
      { $set: req.body }
    );

    res.send(result);
  } catch {
    res.status(500).send({ message: "Failed to update profile" });
  }
});

module.exports = router;