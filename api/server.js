import express from "express";
import cors from "cors";
// Importing body-parser correctly with the default export
import bodyParser from "body-parser";
import { createTransport } from "nodemailer";
import { config } from "dotenv";

// Destructure json and urlencoded from the default import
const { json, urlencoded } = bodyParser;
// Load environment variables from .env file (for local development or Render)
config();

const app = express();

// Middleware
app.use(cors()); // Enable all CORS requests
app.use(json());
app.use(urlencoded({ extended: true }));

// Send OTP endpoint
app.post("/api/send-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    // Configure Nodemailer with environment variables
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Use environment variable for email user
        pass: process.env.EMAIL_PASS, // Use environment variable for email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. Please use this code to verify your account.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Render environment: listen on the port defined by Render or 3000 locally
const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export the app (required for Render deployment)
export default app;
