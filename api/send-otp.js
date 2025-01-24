import { createTransport } from 'nodemailer';
import { config } from 'dotenv';

// Load environment variables from Vercel environment
config();

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail password or app-specific password
  },
});

export default async function handler(req, res) {
  // Set CORS headers for the response
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (for development, adjust as needed)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow these methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow the content-type header

  // Handle preflight requests (OPTIONS request)
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Respond with a success status for preflight
  }

  if (req.method === 'POST') {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. Please use this code to verify your account.`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
