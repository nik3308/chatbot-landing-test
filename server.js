import express from "express";
import path from "node:path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

// Форма обратной связи
app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!email || !name) return res.status(400).json({ error: "Name & email required" });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      from: `"Landing Bot" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      subject: "Новая заявка с лендинга",
      html: `
        <h3>Новая заявка</h3>
        <p><b>Имя:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Телефон:</b> ${phone || "-"}</p>
        <p><b>Сообщение:</b><br/>${message || "-"}</p>
      `
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));