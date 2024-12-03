const axios = require("axios");

export default async function handler(req, res) {
  const PAYPAL_API = "https://api-3t.sandbox.paypal.com/nvp";
  const PAYPAL_USER = "YourAPIUsername";
  const PAYPAL_PWD = "YourAPIPassword";
  const PAYPAL_SIGNATURE = "YourAPISignature";

  try {
    const token = req.query.token;
    const payerId = req.query.PayerID;

    const params = new URLSearchParams({
      USER: PAYPAL_USER,
      PWD: PAYPAL_PWD,
      SIGNATURE: PAYPAL_SIGNATURE,
      METHOD: "DoExpressCheckoutPayment",
      VERSION: "124.0",
      TOKEN: token,
      PAYERID: payerId,
      PAYMENTREQUEST_0_PAYMENTACTION: "Sale",
      PAYMENTREQUEST_0_AMT: "10.00",
      PAYMENTREQUEST_0_CURRENCYCODE: "USD",
    });

    const response = await axios.post(PAYPAL_API, params.toString());
    const data = new URLSearchParams(response.data);

    if (data.get("ACK") === "Success") {
      res.send("Payment successful!");
    } else {
      res.status(500).send("Error completing PayPal checkout.");
    }
  } catch (error) {
    res.status(500).send("Error processing request.");
  }
}
