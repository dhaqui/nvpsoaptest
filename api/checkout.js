const axios = require("axios");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const PAYPAL_API = process.env.PAYPAL_ENDPOINT;
  const PAYPAL_USER = process.env.PAYPAL_USER;
  const PAYPAL_PWD = process.env.PAYPAL_PWD;
  const PAYPAL_SIGNATURE = process.env.PAYPAL_SIGNATURE;
  const RETURN_URL = process.env.PAYPAL_RETURN_URL;
  const CANCEL_URL = process.env.PAYPAL_CANCEL_URL;

  try {
    const params = new URLSearchParams({
      USER: PAYPAL_USER,
      PWD: PAYPAL_PWD,
      SIGNATURE: PAYPAL_SIGNATURE,
      METHOD: "SetExpressCheckout",
      VERSION: "124.0",
      PAYMENTREQUEST_0_PAYMENTACTION: "Sale",
      PAYMENTREQUEST_0_AMT: "10.00",
      PAYMENTREQUEST_0_CURRENCYCODE: "USD",
      RETURNURL: RETURN_URL,
      CANCELURL: CANCEL_URL,
    });

    const response = await axios.post(PAYPAL_API, params.toString());
    const data = new URLSearchParams(response.data);

    if (data.get("ACK") === "Success") {
      const token = data.get("TOKEN");
      res.redirect(\`https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=\${token}\`);
    } else {
      res.status(500).send("Error setting up PayPal checkout.");
    }
  } catch (error) {
    res.status(500).send("Error processing request.");
  }
}
