const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, "../..", "config.env"),
});
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4001;
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(() => {
        console.error("Error while connecting to DB");
        process.exit(1);
    });
