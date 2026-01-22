import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ MISSING EMAIL CONFIGURATION: EMAIL_USER or EMAIL_PASS is not set.");
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Missing email configuration (EMAIL_USER or EMAIL_PASS)");
        }

        const info = await transporter.sendMail({
            from: `"Movie Plus Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log("✅ Message sent: %s", info.messageId);
        return true;
    } catch (error: any) {
        console.error("❌ Error sending email:", error.message);
        if (error.code === 'EAUTH') {
            console.error("👉 Check your EMAIL_USER and EMAIL_PASS. Ensure you are using an App Password if using Gmail.");
        }
        return false;
    }
};
