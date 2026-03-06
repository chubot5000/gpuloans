import { sendEmail } from "./sendEmail";

export async function sendWelcomeEmail(to: string) {
  return sendEmail({
    to,
    subject: "Email connected to USD.AI",
    html: WELCOME_EMAIL_HTML,
  });
}

const WELCOME_EMAIL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>USD.AI Email Connection Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="margin-top: 0;"><strong>Thank you visiting the USD.AI protocol!</strong></h2>
        
        <p>Your email has been successfully connected and you're now signed up to receive important notifications, including:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #ccc; margin: 20px 0;">
            <ul style="margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;"><strong>Available redemptions</strong></li>
                <li style="margin-bottom: 10px;"><strong>Loan Payments</strong></li>
                <li style="margin-bottom: 10px;"><strong>Other time sensitive actions</strong></li>
            </ul>
        </div>
        
        <p>If you would like to unlink your email, go back to the app and click on the Wallet Icon on the top right of the app.</p>
        
        <p>If you have any questions, you can always reach us at <a href="mailto:hello@usd.ai"><strong>hello@usd.ai</strong></a>.</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; text-align: center; margin-bottom: 0;">-- The USD.AI Team</p>
    </div>
</body>
</html>`;
