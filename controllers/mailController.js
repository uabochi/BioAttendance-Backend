const nodemailer = require("nodemailer");

// Send Mail
exports.sendMail = async (req, res) => {
    const { name, email, id } = req.body;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "trackdem52@gmail.com",
    pass: "btdh htso njqt mqil",
  },
  logger: true, // Enable logging
  debug: true, // Enable debugging
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"TrackDem" <trackdem52@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "TrackDem Unique ID!", // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Hello ${name}, here is your student ID: ${id}, do well to keep it safe</b>`, // html body
  });

  
  console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);

  };
  

  
