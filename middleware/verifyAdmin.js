const connectDB = require("../config/db");

const verifyAdmin = async (req, res, next) => {
 const db = await connectDB();
 const usersCollection = db.collection("users");

 const email = req.user?.email;

 const user = await usersCollection.findOne({ email });

 const isAdmin = user?.role === "admin";

 if (!isAdmin) {
  return res.status(403).send({ message: "Forbidden: Admin Only" });
 }

 next();
};

module.exports = verifyAdmin;