import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "../../../config/database.js"; 
import cookie from "cookie";

if (!process.env.JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { db } = await connectToDatabase();
    const users = db.collection("users");

    const user = await users.findOne(
      { email: email.toLowerCase() },
      { projection: { password: 1, name: 1, email: 1 } }
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send token as cookie
    res.setHeader("Set-Cookie", cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
      path: "/",
    }));

    return res.status(200).json({
      message: "Signed in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
