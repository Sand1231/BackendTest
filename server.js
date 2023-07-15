const express = require("express");
const mongoose = require("mongoose");
const courseRouter = require("./routes/courseRouter");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/course", courseRouter);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Server Started");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "Database Connected Successfully and server is listening on this port 5000"
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
