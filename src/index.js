const express = require("express");
const bodyParser = require("body-parser");
const models = require("./models"); // Mengimpor objek models
const cors = require("cors");
const midtransClient = require("midtrans-client");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = {
  origin: "https://petcommerce-site.preview-domain.com", // Mengizinkan akses dari alamat ini
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

// Menghubungkan model dengan sequelize dan database
models.sequelize.sync().then(() => {
  console.log("Database terhubung");

  // Set up routing
  app.get("/", (req, res) => {
    return res.send("Testing Server...");
  });
  app.use("/users", require("./routes/userRoutes"));
  app.use("/sellers", require("./routes/sellerRoutes"));
  app.use("/admin", require("./routes/adminRoutes"));
  app.use("/post", require("./routes/postRoutes"));
  app.use("/categories", require("./routes/categoriesRoutes"));
  app.use("/cart", require("./routes/cartRoutes"));
  app.use("/comments", require("./routes/commentRoutes"));
  app.use("/like", require("./routes/likeRoutes.js"));
  app.use("/order", require("./routes/orderRoutes.js"));

  app.post("/create-payment", async (req, res) => {
    console.log({ body: req.body });
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-iXfWxGK0DQ5rZpWWVvWt-We0",
      clientKey: "SB-Mid-client-w2NPR2ZdFeoLGB7C",
    });

    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({
        success: false,
        message: "Content can not be empty!",
      });
    }

    try {
      snap.createTransaction(req.body).then((transaction) => {
        // transaction token
        let transactionToken = transaction.token;
        console.log("transactionToken:", transactionToken);
        return res.send(transaction.token);
      });
      await models.Order.create({
        user_id: req.body.user_id,
        order_date: new Date(),
        total_price: req.body.transaction_details.gross_amount,
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Jalankan server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
});
