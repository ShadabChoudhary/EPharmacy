const express = require("express");
const Connectdb = require("./Database/db.js");
const dotenv = require("dotenv");
// import DefaultData from "./defaultData.js";
const cors = require("cors");
const web = require("./routes/web.js");
const registerRoute = require("./routes/registerRoute.js");
const order = require("./routes/orderRoutes.js");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || "8000";

app.use(cors());

app.use(express.json());

app.use(cookieParser());

dotenv.config();
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

Connectdb(username, password);

// DefaultData();

app.use("/api", web);
app.use("/api", registerRoute);
app.use("/api", order);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
