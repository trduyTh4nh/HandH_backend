import app from "./src/app";
import env from "dotenv";
env.config();
const PORT: any = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

// import app from "./src/app";
// import serverless from "serverless-http";

module.exports = app;
