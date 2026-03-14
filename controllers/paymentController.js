const stripe = require("../utils/stripe");

exports.createCheckoutSession = async (req, res) => {
 try {
  const { application } = req.body;

  if (!stripe) {
   return res.status(500).send({ message: "Stripe not initialized" });
  }

  const paymentAmount = application.expectedSalary || application.salary;
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
      unit_amount: Math.round(paymentAmount * 100),
     },
     quantity: 1,
    },
   ],
   mode: "payment",
   success_url: `${origin}/dashboard/student/payments/success`,
   cancel_url: `${origin}/dashboard/student/applied-tutors`,
  });

  res.send({ id: session.id, url: session.url });

 } catch (err) {
  res.status(500).send({ message: err.message });
 }
};