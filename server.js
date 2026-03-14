// // // // const express = require("express");
// // // // const cors = require("cors");
// // // // const jwt = require("jsonwebtoken");
// // // // const cookieParser = require("cookie-parser");
// // // // const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// // // // require("dotenv").config();

// // // // let stripe;
// // // // if (process.env.STRIPE_SECRET) {
// // // //   stripe = require("stripe")(process.env.STRIPE_SECRET.trim().replace(/>$/, ""));
// // // // }

// // // // const app = express();
// // // // const port = process.env.PORT || 5000;

// // // // // ===== Middleware =====
// // // // app.use(
// // // //   cors({
// // // //     origin: ["http://localhost:5173"],
// // // //     credentials: true,
// // // //   })
// // // // );
// // // // app.use(express.json());
// // // // app.use(cookieParser());

// // // // // ===== MongoDB Connection =====
// // // // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`;
// // // // const client = new MongoClient(uri, {
// // // //   serverApi: {
// // // //     version: ServerApiVersion.v1,
// // // //     strict: true,
// // // //     deprecationErrors: true,
// // // //   },
// // // // });

// // // // let usersCollection, tuitionsCollection, applicationsCollection, paymentsCollection;

// // // // async function connectDB() {
// // // //   try {
// // // //     await client.connect();
// // // //     console.log("✅ MongoDB Connected");

// // // //     const db = client.db("eTuitionDB");
// // // //     usersCollection = db.collection("users");
// // // //     tuitionsCollection = db.collection("tuitions");
// // // //     applicationsCollection = db.collection("applications");
// // // //     paymentsCollection = db.collection("payments");
// // // //   } catch (err) {
// // // //     console.error("MongoDB Connection Error:", err);
// // // //   }
// // // // }
// // // // connectDB();

// // // // // ===== JWT Middleware =====
// // // // const verifyToken = (req, res, next) => {
// // // //   const token = req.cookies?.token;
// // // //   if (!token) return res.status(401).send({ message: "Unauthorized: No Token Found" });

// // // //   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
// // // //     if (err) return res.status(401).send({ message: "Unauthorized: Invalid Token" });
// // // //     req.user = decoded;
// // // //     next();
// // // //   });
// // // // };

// // // // // ===== Admin Check Middleware =====
// // // // const verifyAdmin = async (req, res, next) => {
// // // //   const email = req.user?.email;
// // // //   const query = { email: email };
// // // //   const user = await usersCollection.findOne(query);
// // // //   const isAdmin = user?.role === 'admin';
// // // //   if (!isAdmin) {
// // // //     return res.status(403).send({ message: "Forbidden: Admin Only" });
// // // //   }
// // // //   next();
// // // // };

// // // // // ==========================================
// // // // // 🔥 ROUTES
// // // // // ==========================================

// // // // app.get("/", (req, res) => {
// // // //   res.send("eTuitionBD Server Running...");
// // // // });

// // // // // --- Auth & Users ---
// // // // app.post("/users", async (req, res) => {
// // // //   try {
// // // //     const user = req.body;
// // // //     const exists = await usersCollection.findOne({ email: user.email });
// // // //     if (exists) return res.send({ message: "User already exists", insertedId: null });
// // // //     const result = await usersCollection.insertOne({
// // // //       ...user,
// // // //       role: user.role || "student",
// // // //       status: user.status || "Verified", 
// // // //       createdAt: new Date(),
// // // //     });
// // // //     res.send(result);
// // // //   } catch (err) {
// // // //     res.status(500).send({ message: "Failed to save user" });
// // // //   }
// // // // });

// // // // app.post("/jwt", async (req, res) => {
// // // //   try {
// // // //     const { email } = req.body;
// // // //     const user = await usersCollection.findOne({ email });
// // // //     if (!user) return res.status(404).send({ message: "User not found" });

// // // //     const token = jwt.sign(
// // // //       { email: user.email, role: user.role },
// // // //       process.env.ACCESS_TOKEN_SECRET,
// // // //       { expiresIn: "10h" }
// // // //     );

// // // //     res
// // // //       .cookie("token", token, {
// // // //         httpOnly: true,
// // // //         secure: process.env.NODE_ENV === "production",
// // // //         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
// // // //       })
// // // //       .send({ success: true, role: user.role });
// // // //   } catch (err) {
// // // //     res.status(500).send({ message: "Failed to generate token" });
// // // //   }
// // // // });

// // // // app.post("/logout", (req, res) => {
// // // //     res.clearCookie("token", {
// // // //         httpOnly: true,
// // // //         secure: process.env.NODE_ENV === "production",
// // // //         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
// // // //     }).send({ success: true });
// // // // });

// // // // app.get("/users/role/:email", verifyToken, async (req, res) => {
// // // //   const email = req.params.email;
// // // //   if (email !== req.user.email) return res.status(403).send({ message: "Forbidden" });
// // // //   const user = await usersCollection.findOne({ email });
// // // //   res.send({ role: user?.role || "student" });
// // // // });

// // // // // --- USER MANAGEMENT (ADMIN ONLY) ---
// // // // app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
// // // //   const result = await usersCollection.find().toArray();
// // // //   res.send(result);
// // // // });

// // // // app.patch("/users/role/:id", verifyToken, verifyAdmin, async (req, res) => {
// // // //   const id = req.params.id;
// // // //   const { role } = req.body; 
// // // //   const result = await usersCollection.updateOne(
// // // //     { _id: new ObjectId(id) }, 
// // // //     { $set: { role: role } }
// // // //   );
// // // //   res.send(result);
// // // // });

// // // // app.patch("/users/update/:id", verifyToken, verifyAdmin, async (req, res) => {
// // // //   const id = req.params.id;
// // // //   const updatedData = req.body; 
// // // //   const result = await usersCollection.updateOne(
// // // //     { _id: new ObjectId(id) },
// // // //     { $set: { 
// // // //         name: updatedData.name, 
// // // //         image: updatedData.image, 
// // // //         status: updatedData.status, 
// // // //         phone: updatedData.phone 
// // // //     } }
// // // //   );
// // // //   res.send(result);
// // // // });

// // // // app.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
// // // //   const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
// // // //   res.send(result);
// // // // });

// // // // // --- TUITION MANAGEMENT ---
// // // // app.post("/tuitions", verifyToken, async (req, res) => {
// // // //   const result = await tuitionsCollection.insertOne({
// // // //     ...req.body,
// // // //     status: "Pending",
// // // //     createdAt: new Date(),
// // // //   });
// // // //   res.send(result);
// // // // });

// // // // app.patch("/tuitions/update/:id", verifyToken, async (req, res) => {
// // // //   const id = req.params.id;
// // // //   const updatedData = req.body;
// // // //   const filter = { _id: new ObjectId(id), studentEmail: req.user.email };
// // // //   const updateDoc = { $set: { ...updatedData, status: "Pending", updatedAt: new Date() } };
// // // //   const result = await tuitionsCollection.updateOne(filter, updateDoc);
// // // //   res.send(result);
// // // // });

// // // // app.get("/tuitions", async (req, res) => {
// // // //   const tuitions = await tuitionsCollection.find({ status: "Approved" }).sort({ createdAt: -1 }).toArray();
// // // //   res.send(tuitions);
// // // // });

// // // // app.get("/my-tuitions/:email", verifyToken, async (req, res) => {
// // // //   const result = await tuitionsCollection.find({ studentEmail: req.params.email }).sort({ createdAt: -1 }).toArray();
// // // //   res.send(result);
// // // // });

// // // // app.get("/admin/all-tuitions", verifyToken, verifyAdmin, async (req, res) => {
// // // //   const result = await tuitionsCollection.find().sort({ createdAt: -1 }).toArray();
// // // //   res.send(result);
// // // // });

// // // // app.patch("/tuitions/status/:id", verifyToken, verifyAdmin, async (req, res) => {
// // // //   const result = await tuitionsCollection.updateOne(
// // // //     { _id: new ObjectId(req.params.id) },
// // // //     { $set: { status: req.body.status } }
// // // //   );
// // // //   res.send(result);
// // // // });

// // // // // --- APPLICATION LOGIC ---
// // // // app.post("/applications", verifyToken, async (req, res) => {
// // // //   const application = req.body;
// // // //   const alreadyApplied = await applicationsCollection.findOne({ 
// // // //     tuitionId: application.tuitionId, 
// // // //     tutorEmail: application.tutorEmail 
// // // //   });
// // // //   if (alreadyApplied) return res.status(400).send({ message: "You already applied!" });

// // // //   const result = await applicationsCollection.insertOne({ ...application, status: "pending", appliedAt: new Date() });
// // // //   res.send(result);
// // // // });

// // // // app.get("/student/applied-tutors/:email", verifyToken, async (req, res) => {
// // // //   const result = await applicationsCollection.find({ studentEmail: req.params.email }).toArray();
// // // //   res.send(result);
// // // // });

// // // // app.patch("/applications/status/:id", verifyToken, async (req, res) => {
// // // //   const result = await applicationsCollection.updateOne(
// // // //     { _id: new ObjectId(req.params.id) },
// // // //     { $set: { status: req.body.status } }
// // // //   );
// // // //   res.send(result);
// // // // });

// // // // app.get("/tutor/my-applications/:email", verifyToken, async (req, res) => {
// // // //   const result = await applicationsCollection.find({ tutorEmail: req.params.email }).toArray();
// // // //   res.send(result);
// // // // });

// // // // // --- SPECIAL ROUTE: APPROVE AFTER PAYMENT ---
// // // // app.patch("/applications/approve-after-payment/:id", verifyToken, async (req, res) => {
// // // //     const appId = req.params.id;
// // // //     const { tuitionId } = req.body;

// // // //     try {
// // // //         const updateApp = await applicationsCollection.updateOne(
// // // //             { _id: new ObjectId(appId) },
// // // //             { $set: { status: "Approved", paid: true } }
// // // //         );

// // // //         await applicationsCollection.updateMany(
// // // //             { 
// // // //                 tuitionId: tuitionId, 
// // // //                 _id: { $ne: new ObjectId(appId) },
// // // //                 status: "pending" 
// // // //             },
// // // //             { $set: { status: "Rejected" } }
// // // //         );

// // // //         await tuitionsCollection.updateOne(
// // // //             { _id: new ObjectId(tuitionId) },
// // // //             { $set: { status: "Booked" } }
// // // //         );

// // // //         res.send(updateApp);
// // // //     } catch (err) {
// // // //         res.status(500).send({ message: "Failed to finalize approval" });
// // // //     }
// // // // });

// // // // // --- STRIPE CHECKOUT ---
// // // // app.post("/create-checkout-session", verifyToken, async (req, res) => {
// // // //   try {
// // // //     const { application } = req.body;
// // // //     if (!stripe) return res.status(500).send({ message: "Stripe not initialized" });

// // // //     const paymentAmount = application.expectedSalary || application.salary;

// // // //     const session = await stripe.checkout.sessions.create({
// // // //       payment_method_types: ["card"],
// // // //       line_items: [
// // // //         {
// // // //           price_data: {
// // // //             currency: "usd",
// // // //             product_data: {
// // // //               name: application.tuitionTitle,
// // // //               description: `Tutor: ${application.tutorEmail}`,
// // // //             },
// // // //             unit_amount: Math.round(paymentAmount * 100), 
// // // //           },
// // // //           quantity: 1,
// // // //         },
// // // //       ],
// // // //       mode: "payment",
// // // //       success_url: `http://localhost:5173/dashboard/student/payments/success?appId=${application._id}&tuitionId=${application.tuitionId}&tutorEmail=${application.tutorEmail}&amount=${paymentAmount}`,
// // // //       cancel_url: `http://localhost:5173/dashboard/student/applied-tutors`,
// // // //       metadata: {
// // // //         applicationId: application._id,
// // // //         tuitionId: application.tuitionId,
// // // //         studentEmail: req.user.email,
// // // //         tutorEmail: application.tutorEmail
// // // //       }
// // // //     });

// // // //     res.send({ id: session.id, url: session.url });
// // // //   } catch (err) {
// // // //     res.status(500).send({ message: err.message });
// // // //   }
// // // // });

// // // // app.post("/payments", verifyToken, async (req, res) => {
// // // //   try {
// // // //     const payment = req.body;
    
// // // //     // ১. পেমেন্ট হিস্ট্রি সেভ
// // // //     const result = await paymentsCollection.insertOne({
// // // //         ...payment,
// // // //         salary: parseFloat(payment.salary), 
// // // //         date: new Date()
// // // //     });

// // // //     // ২. অ্যাপ্লিকেশন 'Approved' এবং 'Paid' মার্ক করা
// // // //     await applicationsCollection.updateOne(
// // // //       { _id: new ObjectId(payment.applicationId) },
// // // //       { $set: { status: "Approved", paid: true } }
// // // //     );

// // // //     // ৩. টিউশন পোস্টটিকে 'Booked' করা
// // // //     await tuitionsCollection.updateOne(
// // // //       { _id: new ObjectId(payment.tuitionId) },
// // // //       { $set: { status: "Booked" } }
// // // //     );

// // // //     res.send(result);
// // // //   } catch (err) {
// // // //     res.status(500).send({ message: "Payment confirmation failed" });
// // // //   }
// // // // });

// // // // // --- REPORTS & ANALYTICS (ADMIN ONLY) ---
// // // // app.get("/admin/analytics", verifyToken, verifyAdmin, async (req, res) => {
// // // //   try {
// // // //     const payments = await paymentsCollection.find().sort({ date: -1 }).toArray();

// // // //     // মোট প্ল্যাটফর্ম ইনকাম হিসাব করা
// // // //     const totalEarnings = payments.reduce((sum, payment) => sum + (payment.salary || 0), 0);

// // // //     const totalUsers = await usersCollection.countDocuments();
// // // //     const totalTuitions = await tuitionsCollection.countDocuments();
// // // //     const successfulPayments = payments.length;

// // // //     res.send({
// // // //       totalEarnings,
// // // //       successfulPayments,
// // // //       totalUsers,
// // // //       totalTuitions,
// // // //       transactionHistory: payments
// // // //     });
// // // //   } catch (err) {
// // // //     res.status(500).send({ message: "Failed to fetch analytics" });
// // // //   }
// // // // });

// // // // app.get("/tutor-revenue/:email", verifyToken, async (req, res) => {
// // // //   const result = await paymentsCollection.find({ tutorEmail: req.params.email }).toArray();
// // // //   res.send(result || []);
// // // // });

// // // // app.get("/user-profile/:email", verifyToken, async (req, res) => {
// // // //   const result = await usersCollection.findOne({ email: req.params.email });
// // // //   res.send(result);
// // // // });

// // // // app.patch("/user-profile/update/:email", verifyToken, async (req, res) => {
// // // //   const email = req.params.email;
// // // //   const updatedData = req.body;
// // // //   const result = await usersCollection.updateOne(
// // // //     { email: email },
// // // //     { $set: updatedData }
// // // //   );
// // // //   res.send(result);
// // // // });

// // // // app.get("/ongoing-tuitions/:email", verifyToken, async (req, res) => {
// // // //   const email = req.params.email;
// // // //   const query = {
// // // //     $or: [{ tutorEmail: email }, { studentEmail: email }],
// // // //     status: "Approved",
// // // //     paid: true
// // // //   };
// // // //   const result = await applicationsCollection.find(query).sort({ appliedAt: -1 }).toArray();
// // // //   res.send(result);
// // // // });

// // // // app.get("/payments/:email", verifyToken, async (req, res) => {
// // // //   const result = await paymentsCollection.find({ studentEmail: req.params.email }).sort({date: -1}).toArray();
// // // //   res.send(result || []);
// // // // });

// // // // app.listen(port, () => {
// // // //   console.log(`🚀 Server running on port ${port}`);
// // // // });



// // // const express = require("express");
// // // const cors = require("cors");
// // // const jwt = require("jsonwebtoken");
// // // const cookieParser = require("cookie-parser");
// // // const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// // // require("dotenv").config();

// // // let stripe;
// // // if (process.env.STRIPE_SECRET) {
// // //   stripe = require("stripe")(process.env.STRIPE_SECRET.trim().replace(/>$/, ""));
// // // }

// // // const app = express();
// // // const port = process.env.PORT || 5000;

// // // // ===== Middleware =====
// // // app.use(
// // //   cors({
// // //     origin: ["http://localhost:5173", "https://your-frontend-domain.vercel.app"], // Frontend URL pore add kore nite parben
// // //     credentials: true,
// // //   })
// // // );
// // // app.use(express.json());
// // // app.use(cookieParser());

// // // // ===== MongoDB Connection =====
// // // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`;
// // // const client = new MongoClient(uri, {
// // //   serverApi: {
// // //     version: ServerApiVersion.v1,
// // //     strict: true,
// // //     deprecationErrors: true,
// // //   },
// // // });

// // // let usersCollection, tuitionsCollection, applicationsCollection, paymentsCollection;

// // // // Vercel Serverless Function-er jonno connection function-ti optimize kora hoyeche
// // // async function connectDB() {
// // //   try {
// // //     if (!client.topology || !client.topology.isConnected()) {
// // //       await client.connect();
// // //       console.log("✅ MongoDB Connected");
// // //     }
// // //     const db = client.db("eTuitionDB");
// // //     usersCollection = db.collection("users");
// // //     tuitionsCollection = db.collection("tuitions");
// // //     applicationsCollection = db.collection("applications");
// // //     paymentsCollection = db.collection("payments");
// // //   } catch (err) {
// // //     console.error("MongoDB Connection Error:", err);
// // //   }
// // // }
// // // connectDB();

// // // // Dynamic Connection Middleware (Serverless safe)
// // // app.use(async (req, res, next) => {
// // //   await connectDB();
// // //   next();
// // // });

// // // // ===== JWT Middleware =====
// // // const verifyToken = (req, res, next) => {
// // //   const token = req.cookies?.token;
// // //   if (!token) return res.status(401).send({ message: "Unauthorized: No Token Found" });

// // //   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
// // //     if (err) return res.status(401).send({ message: "Unauthorized: Invalid Token" });
// // //     req.user = decoded;
// // //     next();
// // //   });
// // // };

// // // // ===== Admin Check Middleware =====
// // // const verifyAdmin = async (req, res, next) => {
// // //   const email = req.user?.email;
// // //   const query = { email: email };
// // //   const user = await usersCollection.findOne(query);
// // //   const isAdmin = user?.role === 'admin';
// // //   if (!isAdmin) {
// // //     return res.status(403).send({ message: "Forbidden: Admin Only" });
// // //   }
// // //   next();
// // // };

// // // // ==========================================
// // // // 🔥 ROUTES
// // // // ==========================================

// // // app.get("/", (req, res) => {
// // //   res.send("eTuitionBD Server Running...");
// // // });

// // // // --- Auth & Users ---
// // // app.post("/users", async (req, res) => {
// // //   try {
// // //     const user = req.body;
// // //     const exists = await usersCollection.findOne({ email: user.email });
// // //     if (exists) return res.send({ message: "User already exists", insertedId: null });
// // //     const result = await usersCollection.insertOne({
// // //       ...user,
// // //       role: user.role || "student",
// // //       status: user.status || "Verified", 
// // //       createdAt: new Date(),
// // //     });
// // //     res.send(result);
// // //   } catch (err) {
// // //     res.status(500).send({ message: "Failed to save user" });
// // //   }
// // // });

// // // app.post("/jwt", async (req, res) => {
// // //   try {
// // //     const { email } = req.body;
// // //     const user = await usersCollection.findOne({ email });
// // //     if (!user) return res.status(404).send({ message: "User not found" });

// // //     const token = jwt.sign(
// // //       { email: user.email, role: user.role },
// // //       process.env.ACCESS_TOKEN_SECRET,
// // //       { expiresIn: "10h" }
// // //     );

// // //     res
// // //       .cookie("token", token, {
// // //         httpOnly: true,
// // //         secure: true, // Vercel-er HTTPS-er jonno true
// // //         sameSite: "none", // Cross-domain login support
// // //       })
// // //       .send({ success: true, role: user.role });
// // //   } catch (err) {
// // //     res.status(500).send({ message: "Failed to generate token" });
// // //   }
// // // });

// // // app.post("/logout", (req, res) => {
// // //     res.clearCookie("token", {
// // //         httpOnly: true,
// // //         secure: true,
// // //         sameSite: "none",
// // //     }).send({ success: true });
// // // });

// // // app.get("/users/role/:email", verifyToken, async (req, res) => {
// // //   const email = req.params.email;
// // //   if (email !== req.user.email) return res.status(403).send({ message: "Forbidden" });
// // //   const user = await usersCollection.findOne({ email });
// // //   res.send({ role: user?.role || "student" });
// // // });

// // // // --- USER MANAGEMENT (ADMIN ONLY) ---
// // // app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
// // //   const result = await usersCollection.find().toArray();
// // //   res.send(result);
// // // });

// // // app.patch("/users/role/:id", verifyToken, verifyAdmin, async (req, res) => {
// // //   const id = req.params.id;
// // //   const { role } = req.body; 
// // //   const result = await usersCollection.updateOne(
// // //     { _id: new ObjectId(id) }, 
// // //     { $set: { role: role } }
// // //   );
// // //   res.send(result);
// // // });

// // // app.patch("/users/update/:id", verifyToken, verifyAdmin, async (req, res) => {
// // //   const id = req.params.id;
// // //   const updatedData = req.body; 
// // //   const result = await usersCollection.updateOne(
// // //     { _id: new ObjectId(id) },
// // //     { $set: { 
// // //         name: updatedData.name, 
// // //         image: updatedData.image, 
// // //         status: updatedData.status, 
// // //         phone: updatedData.phone 
// // //     } }
// // //   );
// // //   res.send(result);
// // // });

// // // app.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
// // //   const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
// // //   res.send(result);
// // // });

// // // // --- TUITION MANAGEMENT ---
// // // app.post("/tuitions", verifyToken, async (req, res) => {
// // //   const result = await tuitionsCollection.insertOne({
// // //     ...req.body,
// // //     status: "Pending",
// // //     createdAt: new Date(),
// // //   });
// // //   res.send(result);
// // // });

// // // app.patch("/tuitions/update/:id", verifyToken, async (req, res) => {
// // //   const id = req.params.id;
// // //   const updatedData = req.body;
// // //   const filter = { _id: new ObjectId(id), studentEmail: req.user.email };
// // //   const updateDoc = { $set: { ...updatedData, status: "Pending", updatedAt: new Date() } };
// // //   const result = await tuitionsCollection.updateOne(filter, updateDoc);
// // //   res.send(result);
// // // });

// // // app.get("/tuitions", async (req, res) => {
// // //   const tuitions = await tuitionsCollection.find({ status: "Approved" }).sort({ createdAt: -1 }).toArray();
// // //   res.send(tuitions);
// // // });

// // // app.get("/my-tuitions/:email", verifyToken, async (req, res) => {
// // //   const result = await tuitionsCollection.find({ studentEmail: req.params.email }).sort({ createdAt: -1 }).toArray();
// // //   res.send(result);
// // // });

// // // app.get("/admin/all-tuitions", verifyToken, verifyAdmin, async (req, res) => {
// // //   const result = await tuitionsCollection.find().sort({ createdAt: -1 }).toArray();
// // //   res.send(result);
// // // });

// // // app.patch("/tuitions/status/:id", verifyToken, verifyAdmin, async (req, res) => {
// // //   const result = await tuitionsCollection.updateOne(
// // //     { _id: new ObjectId(req.params.id) },
// // //     { $set: { status: req.body.status } }
// // //   );
// // //   res.send(result);
// // // });

// // // // --- APPLICATION LOGIC ---
// // // app.post("/applications", verifyToken, async (req, res) => {
// // //   const application = req.body;
// // //   const alreadyApplied = await applicationsCollection.findOne({ 
// // //     tuitionId: application.tuitionId, 
// // //     tutorEmail: application.tutorEmail 
// // //   });
// // //   if (alreadyApplied) return res.status(400).send({ message: "You already applied!" });

// // //   const result = await applicationsCollection.insertOne({ ...application, status: "pending", appliedAt: new Date() });
// // //   res.send(result);
// // // });

// // // app.get("/student/applied-tutors/:email", verifyToken, async (req, res) => {
// // //   const result = await applicationsCollection.find({ studentEmail: req.params.email }).toArray();
// // //   res.send(result);
// // // });

// // // app.patch("/applications/status/:id", verifyToken, async (req, res) => {
// // //   const result = await applicationsCollection.updateOne(
// // //     { _id: new ObjectId(req.params.id) },
// // //     { $set: { status: req.body.status } }
// // //   );
// // //   res.send(result);
// // // });

// // // app.get("/tutor/my-applications/:email", verifyToken, async (req, res) => {
// // //   const result = await applicationsCollection.find({ tutorEmail: req.params.email }).toArray();
// // //   res.send(result);
// // // });

// // // // --- SPECIAL ROUTE: APPROVE AFTER PAYMENT ---
// // // app.patch("/applications/approve-after-payment/:id", verifyToken, async (req, res) => {
// // //     const appId = req.params.id;
// // //     const { tuitionId } = req.body;

// // //     try {
// // //         const updateApp = await applicationsCollection.updateOne(
// // //             { _id: new ObjectId(appId) },
// // //             { $set: { status: "Approved", paid: true } }
// // //         );

// // //         await applicationsCollection.updateMany(
// // //             { 
// // //                 tuitionId: tuitionId, 
// // //                 _id: { $ne: new ObjectId(appId) },
// // //                 status: "pending" 
// // //             },
// // //             { $set: { status: "Rejected" } }
// // //         );

// // //         await tuitionsCollection.updateOne(
// // //             { _id: new ObjectId(tuitionId) },
// // //             { $set: { status: "Booked" } }
// // //         );

// // //         res.send(updateApp);
// // //     } catch (err) {
// // //         res.status(500).send({ message: "Failed to finalize approval" });
// // //     }
// // // });

// // // // --- STRIPE CHECKOUT ---
// // // app.post("/create-checkout-session", verifyToken, async (req, res) => {
// // //   try {
// // //     const { application } = req.body;
// // //     if (!stripe) return res.status(500).send({ message: "Stripe not initialized" });

// // //     const paymentAmount = application.expectedSalary || application.salary;
// // //     const origin = req.headers.origin;

// // //     const session = await stripe.checkout.sessions.create({
// // //       payment_method_types: ["card"],
// // //       line_items: [
// // //         {
// // //           price_data: {
// // //             currency: "usd",
// // //             product_data: {
// // //               name: application.tuitionTitle,
// // //               description: `Tutor: ${application.tutorEmail}`,
// // //             },
// // //             unit_amount: Math.round(paymentAmount * 100), 
// // //           },
// // //           quantity: 1,
// // //         },
// // //       ],
// // //       mode: "payment",
// // //       success_url: `${origin}/dashboard/student/payments/success?appId=${application._id}&tuitionId=${application.tuitionId}&tutorEmail=${application.tutorEmail}&amount=${paymentAmount}`,
// // //       cancel_url: `${origin}/dashboard/student/applied-tutors`,
// // //       metadata: {
// // //         applicationId: application._id,
// // //         tuitionId: application.tuitionId,
// // //         studentEmail: req.user.email,
// // //         tutorEmail: application.tutorEmail
// // //       }
// // //     });

// // //     res.send({ id: session.id, url: session.url });
// // //   } catch (err) {
// // //     res.status(500).send({ message: err.message });
// // //   }
// // // });

// // // app.post("/payments", verifyToken, async (req, res) => {
// // //   try {
// // //     const payment = req.body;
    
// // //     // ১. পেমেন্ট হিস্ট্রি সেভ
// // //     const result = await paymentsCollection.insertOne({
// // //         ...payment,
// // //         salary: parseFloat(payment.salary), 
// // //         date: new Date()
// // //     });

// // //     // ২. অ্যাপ্লিকেশন 'Approved' এবং 'Paid' মার্ক করা
// // //     await applicationsCollection.updateOne(
// // //       { _id: new ObjectId(payment.applicationId) },
// // //       { $set: { status: "Approved", paid: true } }
// // //     );

// // //     // ৩. টিউশন পোস্টটিকে 'Booked' করা
// // //     await tuitionsCollection.updateOne(
// // //       { _id: new ObjectId(payment.tuitionId) },
// // //       { $set: { status: "Booked" } }
// // //     );

// // //     res.send(result);
// // //   } catch (err) {
// // //     res.status(500).send({ message: "Payment confirmation failed" });
// // //   }
// // // });

// // // // --- REPORTS & ANALYTICS (ADMIN ONLY) ---
// // // app.get("/admin/analytics", verifyToken, verifyAdmin, async (req, res) => {
// // //   try {
// // //     const payments = await paymentsCollection.find().sort({ date: -1 }).toArray();

// // //     const totalEarnings = payments.reduce((sum, payment) => sum + (payment.salary || 0), 0);
// // //     const totalUsers = await usersCollection.countDocuments();
// // //     const totalTuitions = await tuitionsCollection.countDocuments();
// // //     const successfulPayments = payments.length;

// // //     res.send({
// // //       totalEarnings,
// // //       successfulPayments,
// // //       totalUsers,
// // //       totalTuitions,
// // //       transactionHistory: payments
// // //     });
// // //   } catch (err) {
// // //     res.status(500).send({ message: "Failed to fetch analytics" });
// // //   }
// // // });

// // // app.get("/tutor-revenue/:email", verifyToken, async (req, res) => {
// // //   const result = await paymentsCollection.find({ tutorEmail: req.params.email }).toArray();
// // //   res.send(result || []);
// // // });

// // // app.get("/user-profile/:email", verifyToken, async (req, res) => {
// // //   const result = await usersCollection.findOne({ email: req.params.email });
// // //   res.send(result);
// // // });

// // // app.patch("/user-profile/update/:email", verifyToken, async (req, res) => {
// // //   const email = req.params.email;
// // //   const updatedData = req.body;
// // //   const result = await usersCollection.updateOne(
// // //     { email: email },
// // //     { $set: updatedData }
// // //   );
// // //   res.send(result);
// // // });

// // // app.get("/ongoing-tuitions/:email", verifyToken, async (req, res) => {
// // //   const email = req.params.email;
// // //   const query = {
// // //     $or: [{ tutorEmail: email }, { studentEmail: email }],
// // //     status: "Approved",
// // //     paid: true
// // //   };
// // //   const result = await applicationsCollection.find(query).sort({ appliedAt: -1 }).toArray();
// // //   res.send(result);
// // // });

// // // app.get("/payments/:email", verifyToken, async (req, res) => {
// // //   const result = await paymentsCollection.find({ studentEmail: req.params.email }).sort({date: -1}).toArray();
// // //   res.send(result || []);
// // // });

// // // // Local development-er jonno app.listen thakuk
// // // if (process.env.NODE_ENV !== 'production') {
// // //   app.listen(port, () => {
// // //     console.log(`🚀 Server running on port ${port}`);
// // //   });
// // // }

// // // // ⚠️ Vercel export (Must required)
// // // module.exports = app;


// // // const express = require("express");
// // // const cors = require("cors");
// // // const cookieParser = require("cookie-parser");

// // // require("dotenv").config();

// // // const userRoutes = require("./routes/userRoutes");
// // // const tuitionRoutes = require("./routes/tuitionRoutes");

// // // const app = express();
// // // const port = process.env.PORT || 5000;

// // // app.use(
// // //  cors({
// // //   origin: ["http://localhost:5173"],
// // //   credentials: true,
// // //  })
// // // );

// // // app.use(express.json());
// // // app.use(cookieParser());

// // // app.use("/", userRoutes);
// // // app.use("/", tuitionRoutes);

// // // app.get("/", (req, res) => {
// // //  res.send("eTuitionBD Server Running...");
// // // });

// // // if (process.env.NODE_ENV !== "production") {
// // //  app.listen(port, () => {
// // //   console.log(`🚀 Server running on port ${port}`);
// // //  });
// // // }

// // // module.exports = app;

// // // const express = require("express");
// // // const cors = require("cors");
// // // const cookieParser = require("cookie-parser");

// // // require("dotenv").config();

// // // const userRoutes = require("./routes/userRoutes");
// // // const tuitionRoutes = require("./routes/tuitionRoutes");
// // // const applicationRoutes = require("./routes/applicationRoutes");
// // // const paymentRoutes = require("./routes/paymentRoutes");
// // // const adminRoutes = require("./routes/adminRoutes");

// // // const app = express();
// // // const port = process.env.PORT || 5000;

// // // // middleware
// // // app.use(
// // // cors({
// // // origin: ["http://localhost:5173"],
// // // credentials: true,
// // // })
// // // );

// // // app.use(express.json());
// // // app.use(cookieParser());

// // // // routes
// // // app.use("/", userRoutes);
// // // app.use("/", tuitionRoutes);
// // // app.use("/", applicationRoutes);
// // // app.use("/", paymentRoutes);
// // // app.use("/", adminRoutes);

// // // // root route
// // // app.get("/", (req, res) => {
// // // res.send("eTuitionBD Server Running...");
// // // });

// // // // start server
// // // if (process.env.NODE_ENV !== "production") {
// // // app.listen(port, () => {
// // // console.log(`🚀 Server running on port ${port}`);
// // // });
// // // }

// // // // vercel export
// // // module.exports = app;


// // const express = require("express");
// // const cors = require("cors");
// // const cookieParser = require("cookie-parser");

// // require("dotenv").config();

// // const userRoutes = require("./routes/userRoutes");
// // const tuitionRoutes = require("./routes/tuitionRoutes");
// // const applicationRoutes = require("./routes/applicationRoutes");
// // const paymentRoutes = require("./routes/paymentRoutes");
// // const adminRoutes = require("./routes/adminRoutes");

// // const app = express();
// // const port = process.env.PORT || 5000;

// // // middleware
// // app.use(
// //   cors({
// //     origin: [
// //       "http://localhost:5173",
// //       process.env.FRONTEND_URL || "https://etuitionbd-portal.netlify.app/"
// //     ],
// //     credentials: true,
// //   })
// // );

// // app.use(express.json());
// // app.use(cookieParser());

// // // routes
// // app.use("/", userRoutes);
// // app.use("/", tuitionRoutes);
// // app.use("/", applicationRoutes);
// // app.use("/", paymentRoutes);
// // app.use("/", adminRoutes);

// // // root route
// // app.get("/", (req, res) => {
// //   res.send("eTuitionBD Server Running...");
// // });

// // // start server (local development)
// // if (process.env.NODE_ENV !== "production") {
// //   app.listen(port, () => {
// //     console.log(`🚀 Server running on port ${port}`);
// //   });
// // }

// // // vercel export
// // module.exports = app;



// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");

// require("dotenv").config();

// const userRoutes = require("./routes/userRoutes");
// const tuitionRoutes = require("./routes/tuitionRoutes");
// const applicationRoutes = require("./routes/applicationRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// const adminRoutes = require("./routes/adminRoutes");

// const app = express();
// const port = process.env.PORT || 5000;

// // middleware
// const allowedOrigins = [
//   "http://localhost:5173",
//   process.env.FRONTEND_URL || "https://etuitionbd-portal.netlify.app"
// ];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(cookieParser());

// // routes
// app.use("/", userRoutes);
// app.use("/", tuitionRoutes);
// app.use("/", applicationRoutes);
// app.use("/", paymentRoutes);
// app.use("/", adminRoutes);

// // root route
// app.get("/", (req, res) => {
//   res.send("eTuitionBD Server Running...");
// });

// // start server (only for local development)
// if (process.env.NODE_ENV !== "production") {
//   app.listen(port, () => {
//     console.log(`🚀 Server running on port ${port}`);
//   });
// }

// // export for vercel serverless
// module.exports = app;



const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const tuitionRoutes = require("./routes/tuitionRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL || "https://etuitionbd-portal.netlify.app"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/", userRoutes);
app.use("/", tuitionRoutes);
app.use("/", applicationRoutes);
app.use("/", paymentRoutes);
app.use("/", adminRoutes);

// root route
app.get("/", (req, res) => {
  res.send("eTuitionBD Server Running...");
});

// start server (local development only)
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

// export for vercel
module.exports = app;
