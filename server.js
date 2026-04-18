import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import { UserApp } from "./APIs/UserAPI.js";
import cors from "cors";

config();

const app = exp();

// CORS (temporary open)
app.use(cors({
  origin: "*"
}));

app.use(exp.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// routes
app.use("/user-api", UserApp);

// DB connection
async function connectDB() {
  try {
    await connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`server on port ${port}`));
  } catch (err) {
    console.log("err in DB connection :", err);
  }
}

connectDB();

// error middleware
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate field value",
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
});