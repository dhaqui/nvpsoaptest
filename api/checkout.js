const axios = require("axios");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const PAYPAL_API = "https://api-3t.sandbox.paypal.com/nvp";
  const PAYPAL_USER = "testpp5678_api1.gmail.com";
  const PAYPAL_PWD = "VB6XFM4ECSJJWC3Z";
  const PAYPAL_SIGNATURE = "AtrtuiK97tX1CiU8WNBpJkGLm2U9A8PbX9onAIILKx-eushGlrAM2BIF";
  const RETURN_URL = "https://your-vercel-domain.vercel.app/api/success";
  const CANCEL_URL = "https://your-vercel-domain.vercel.app/api/cancel";

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
