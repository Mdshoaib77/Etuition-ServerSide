// const connectDB = require("../config/db");
// const jwt = require("jsonwebtoken");
// const { ObjectId } = require("mongodb");

// exports.createUser = async (req, res) => {
//  try {
//   const db = await connectDB();
//   const usersCollection = db.collection("users");

//   const user = req.body;

//   const exists = await usersCollection.findOne({ email: user.email });

//   if (exists) {
//    return res.send({ message: "User already exists", insertedId: null });
//   }

//   const result = await usersCollection.insertOne({
//    ...user,
//    role: user.role || "student",
//    status: user.status || "Verified",
//    createdAt: new Date(),
//   });

//   res.send(result);
//  } catch {
//   res.status(500).send({ message: "Failed to save user" });
//  }
// };

// exports.generateJWT = async (req, res) => {
//  try {
//   const db = await connectDB();
//   const usersCollection = db.collection("users");

//   const { email } = req.body;

//   const user = await usersCollection.findOne({ email });

//   if (!user) return res.status(404).send({ message: "User not found" });

//   const token = jwt.sign(
//    { email: user.email, role: user.role },
//    process.env.ACCESS_TOKEN_SECRET,
//    { expiresIn: "10h" }
//   );

//   res.cookie("token", token, {
//    httpOnly: true,
//    secure: true,
//    sameSite: "none",
//   }).send({ success: true, role: user.role });

//  } catch {
//   res.status(500).send({ message: "Failed to generate token" });
//  }
// };

// exports.logout = (req, res) => {
//  res.clearCookie("token", {
//   httpOnly: true,
//   secure: true,
//   sameSite: "none",
//  }).send({ success: true });
// };


const connectDB = require("../config/db");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

exports.createUser = async (req, res) => {
 try {
  const db = await connectDB();
  const usersCollection = db.collection("users");

  const user = req.body;

  // check existing user
  const exists = await usersCollection.findOne({ email: user.email });

  if (exists) {
   return res.send({ message: "User already exists", insertedId: null });
  }

  // insert user
  const result = await usersCollection.insertOne({
   ...user,
   image: user.image || "", // profile image support
   role: user.role || "student",
   status: user.status || "Verified",
   createdAt: new Date(),
  });

  res.send(result);
 } catch (error) {
  console.error("Create user error:", error);
  res.status(500).send({ message: "Failed to save user" });
 }
};

exports.generateJWT = async (req, res) => {
 try {
  const db = await connectDB();
  const usersCollection = db.collection("users");

  const { email } = req.body;

  const user = await usersCollection.findOne({ email });

  if (!user) {
   return res.status(404).send({ message: "User not found" });
  }

  const token = jwt.sign(
   { email: user.email, role: user.role },
   process.env.ACCESS_TOKEN_SECRET,
   { expiresIn: "10h" }
  );

  res
   .cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
   })
   .send({ success: true, role: user.role, image: user.image });

 } catch (error) {
  console.error("JWT error:", error);
  res.status(500).send({ message: "Failed to generate token" });
 }
};

exports.logout = (req, res) => {
 res
  .clearCookie("token", {
   httpOnly: true,
   secure: true,
   sameSite: "none",
  })
  .send({ success: true });
};