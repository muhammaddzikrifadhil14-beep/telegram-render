const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Telegram Order Server is running!");
});

app.post("/api/order", async (req, res) => {
  try {
    const { product, price, whatsapp, payment } = req.body;

    if (!product || !price || !whatsapp || !payment) {
      return res.status(400).json({
        success: false,
        message: "Data pesanan belum lengkap."
      });
    }

    const message = `
🔥 PESANAN BARU 🔥

Produk: ${product}
Harga: ${price}
WhatsApp: ${whatsapp}
Pembayaran: ${payment}

Status: Menunggu pembayaran
`;

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message
        })
      }
    );

    const result = await response.json();

    if (!result.ok) {
      console.error(result);

      return res.status(500).json({
        success: false,
        message: "Gagal mengirim ke Telegram."
      });
    }

    res.json({
      success: true,
      message: "Pesanan berhasil dikirim ke Telegram."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
