import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import { UserApp } from "./APIs/UserAPI.js";
import cors from "cors";

// Load env variables
config();

const app = exp();

// ✅ CORS (secure - allow only frontend)
app.use(cors({
  origin: [
    "http://localhost:5173",              
    "https://user-management-app-nu-vert.vercel.app"    
  ],
  credentials: true
}));

// Middleware
app.use(exp.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ Routes
app.use("/user-api", UserApp);

// ✅ DB Connection + Server Start
async function connectDB() {
  try {
    await connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`server running on port ${port}`);
    });

  } catch (err) {
    console.error("DB connection error:", err);
  }
}

connectDB();

// ✅ Global Error Handler
app.use((err, req, res, next) => {

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format"
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate field value"
    });
  }

  res.status(500).json({
    message: "Internal Server Error"
  });
});