const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "antika.noor98@gmail.com",
    pass: "waztitnaaksakjmx",
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
      from: "antika.noor98@gmail.com",
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
