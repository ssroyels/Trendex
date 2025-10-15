// pages/api/phonepay/token.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await axios.post(
      "https://api-preprod.phonepe.com/apis/identity-manager/v1/oauth/token",
      {
        clientId: process.env.PHONEPE_CLIENT_ID,
        clientSecret: process.env.PHONEPE_CLIENT_SECRET,
        grantType: "client_credentials",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("❌ PhonePe Token Error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ success: false, error: error.response?.data || error.message });
  }
}
