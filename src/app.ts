// import express, { Request, Response, NextFunction } from "express";

// import bodyParser from "body-parser";
// const app = express();
// import morgan from "morgan";
// import helmet from "helmet";
// import compression from "compression";
// import { BadRequestError, ErrorResponse } from "./core/error.response";
// import cors from "cors";
// import multer from "multer";
// const upload = multer();
// // config
// app.use(morgan("dev"));
// app.use(helmet());
// app.use(compression());
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );
// app.use(upload.any());

// // init database
// require("./db/init.mongo");
// // storage config

// // init router
// import mainRouter from "./router/main/index";
// app.use("/", mainRouter);
// // handling error
// app.use((req: Request, res: Response, next: NextFunction) => {
//   const error = new BadRequestError("Not found");
//   error.status = 404;
//   next(error);
// });

// app.use(
//   (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
//     const statusCode = error.status || 500;
//     console.log("Lỗi (app.ts): ", error);

//     return res.status(statusCode).json({
//       status: "error",
//       code: statusCode,
//       stack: error.stack,
//       message: error.message,
//     });
//   }
// );

// export default app;

import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { BadRequestError, ErrorResponse } from "./core/error.response";
import cors from "cors";
import multer from "multer";
const upload = multer();

const app = express();

// config
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(upload.any());

// init database
require("./db/init.mongo");

// init router
import mainRouter from "./router/main/index";
app.use("/", mainRouter);

app.get("/", (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Steve's Backend Server</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Steve's Backend Server</h1>
        <p>This is a backend server built by Steve (Trần Duy Thanh).</p>
        <p>It is powered by Node.js and Express.</p>
      </div>
    </body>
    </html>
  `);
});

// handling error
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new BadRequestError("Not found");
  error.status = 404;
  next(error);
});

app.use(
  (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500;
    console.log("Lỗi (app.ts): ", error);

    return res.status(statusCode).json({
      status: "error",
      code: statusCode,
      stack: error.stack,
      message: error.message,
    });
  }
);

export default app;
