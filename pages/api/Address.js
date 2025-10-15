import connectDb from "@/middleware/mongoose";
import Address from "@/models/Address";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
      if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const userId = decoded.id;
      const { name, email, phone, localAddress, pincode, city, state } = req.body;

      if (!name || !email || !phone || !city || !state || !pincode || !localAddress)
        return res.status(400).json({ error: "All fields are required" });

      const newAddress = new Address({ name, email, phone, localAddress, pincode, city, state, userId });
      await newAddress.save();

      return res.status(200).json({ message: "Address added successfully" });
    } catch (error) {
      console.error("Error saving address:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
