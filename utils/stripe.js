// let stripe;

// if (process.env.STRIPE_SECRET) {
//  stripe = require("stripe")(process.env.STRIPE_SECRET.trim().replace(/>$/, ""));
// }

// module.exports = stripe;

let stripe;

if (process.env.STRIPE_SECRET) {
  stripe = require("stripe")(process.env.STRIPE_SECRET.trim());
}

module.exports = stripe;