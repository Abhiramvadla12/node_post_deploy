import express from "express";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import { createTransport } from "nodemailer";
import { config } from "dotenv";

// Load environment variables from Vercel environment
config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",  // Allow requests from your local frontend
  methods: ["GET", "POST"],         // Allow GET and POST methods
  allowedHeaders: ["Content-Type"], // Allow Content-Type header
};

// Apply CORS middleware with the specified options
app.use(cors(corsOptions));

app.use(json());
app.use(urlencoded({ extended: true }));

app.post("/send-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. Please use this code to verify your account.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Export the app (required for Vercel deployment)
export default app;
