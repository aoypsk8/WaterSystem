import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

//controller
import authRoute from "./Routers/authRoute";
import productRoute from "./Routers/productRoute";
import userRoute from "./Routers/userRoute";
import categoryRoute from "./Routers/categoryRoute";
import speechRoute from "./Routers/speechRoute";

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Use Static Files
app.use("/uploads", express.static("uploads"));
app.use("/uploads/images", express.static("uploads/images"));

app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/speech", speechRoute);



app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}`);
  console.log(`Press Ctrl+C to quit.`);
});
