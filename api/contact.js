import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER,
    subject: `Portfolio Contact from ${name}`,
    text: `You have received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f4f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }
          .header {
            background-color: #18181b;
            padding: 30px 40px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: 1px;
          }
          .content {
            padding: 40px;
          }
          .badge {
            display: inline-block;
            background-color: #e0e7ff;
            color: #4338ca;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 20px;
          }
          .info-group {
            margin-bottom: 24px;
          }
          .label {
            font-size: 13px;
            color: #71717a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .value {
            font-size: 16px;
            color: #27272a;
            font-weight: 500;
          }
          .message-box {
            background-color: #f4f4f5;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #18181b;
            font-size: 15px;
            line-height: 1.6;
            color: #3f3f46;
            white-space: pre-wrap;
          }
          .footer {
            background-color: #fafafa;
            padding: 20px 40px;
            text-align: center;
            border-top: 1px solid #e4e4e7;
          }
          .footer p {
            margin: 0;
            color: #a1a1aa;
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PORTFOLIO CONTACT</h1>
          </div>
          <div class="content">
            <span class="badge">New Inquiry</span>
            
            <div class="info-group">
              <div class="label">Name</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="info-group">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${email}" style="color: #4338ca; text-decoration: none;">${email}</a></div>
            </div>
            
            <div class="info-group">
              <div class="label">Message</div>
              <div class="message-box">${message}</div>
            </div>
          </div>
          <div class="footer">
            <p>Sent securely from your Vercel Serverless Function.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
