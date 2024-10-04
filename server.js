"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT;
app_1.default.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
// import app from "./src/app";
const serverless_http_1 = __importDefault(require("serverless-http"));
module.exports.handler = (0, serverless_http_1.default)(app_1.default);
