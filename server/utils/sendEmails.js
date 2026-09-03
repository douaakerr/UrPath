import axios from "axios";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.EMAIL_SENDER_NAME,
          email: process.env.EMAIL_SENDER,
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env._API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("Email sent successfully");
  } catch (error) {
    console.error(
      "Brevo error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to send email");
  }
};