const nodemailer = require("nodemailer");
const { appConfig } = require("../config/constant");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: appConfig.gmailUsername,
    pass: appConfig.gmailPassword,
  },
});

interface SendMailResult {
  response: string;
  envelope: {
    from: string;
    to: string[];
  };
  messageId: string;
}

const sendMail = async (
  recipientEmail: string,
  subject: string,
  htmlBody: string
): Promise<SendMailResult> => {
  try {
    const result = await transporter.sendMail({
      from: appConfig.gmailId,
      to: recipientEmail,
      subject: subject,
      html: htmlBody,
    });

    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export { sendMail };
