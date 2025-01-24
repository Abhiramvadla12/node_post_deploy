import { createTransport } from 'nodemailer';
import { config } from 'dotenv';
import cors from 'cors';

// Load environment variables from Vercel environment
config();

// Enable CORS for this function
const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail password or app-specific password
  },
});

export default async function handler(req, res) {
  // Apply CORS headers to the response
  cors()(req, res, async () => {
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
  });
}
