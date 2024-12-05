const nodemailer = require("nodemailer");

// Send Mail
exports.sendMail = async (req, res) => {
    const { name, email, id } = req.body;
  
    // if (!name || !email) {
    //   return res.status(400).json({ error: 'Name and email are required' });
    // }
  
    // try {
    //   const [result] = await db.query(
    //     'INSERT INTO staff (name, email, created_by) VALUES (?, ?, ?)',
    //     [name, email, created_by || null]
    //   );
    //   res.status(201).json({ message: 'Staff added successfully', staffId: result.insertId });
    // } catch (error) {
    //   if (error.code === 'ER_DUP_ENTRY') {
    //     return res.status(400).json({ error: 'Email already exists' });
    //   }
    //   res.status(500).json({ error: 'Server error', details: error.message });
    // }

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
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);

  };
  

  
