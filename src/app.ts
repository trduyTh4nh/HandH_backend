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
app.get("/hello", (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "Hello" });
});
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "HELLO HANDH" });
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
