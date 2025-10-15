import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import bcrypt from "bcrypt";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      let { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      email = email.toLowerCase();

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: "User already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);

