import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

type SendEmailParams = {
    to: string;
    subject: string;
    html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.warn('⚠️ SMTP Configuration missing. Email not sent.');
        console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
        return false;
    }

    try {
        const info = await transporter.sendMail({
            from: `"Diva Market" <${SMTP_USER}>`, // sender address
            to,
            subject,
            html,
        });

        console.log('✅ Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return false;
    }
}
