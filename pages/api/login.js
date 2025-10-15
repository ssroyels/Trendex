import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // normalize email
      const normalizedEmail = email.toLowerCase();

      const existingUser = await User.findOne({ email: normalizedEmail });
      if (!existingUser) {
        return res.status(401).json({ error: "User does not exist, please register" });
      }

      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // generate JWT
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // remove password before sending
      const { password: _, ...userData } = existingUser._doc;

      return res.status(200).json({
        success: true,
        message: "User login successful",
        user: userData,
        token,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);

