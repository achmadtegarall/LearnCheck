require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const assessmentRoutes = require("./routes/assessment.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://learncheck-a25-cs155.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

app.use(bodyParser.json());

app.use("/assessment", assessmentRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
