const express = require("express");
const app = express();

const userRoutes = require("./routes/user.route");
const teamRoutes = require("./routes/teams.route");
const panelistRoute = require("./routes/panelist.route");
const hackathonRoute = require("./routes/hackathon.route");


const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 4000;

dotenv.config();

database.connect();
 
// Middlewares
app.use(express.json()); // For JSON body parsing
app.use(express.urlencoded({ extended: true })); // For form-data parsing
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	})
);

// Setting up routes

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/panelist", panelistRoute);
app.use("/api/v1/hackathon", hackathonRoute);

// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});
