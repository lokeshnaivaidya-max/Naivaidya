import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
const corsOrigins = process.env["CORS_ORIGIN"]
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || !corsOrigins || corsOrigins.length === 0) {
        callback(null, true);
        return;
      }

      callback(null, corsOrigins.includes(origin));
    },
  }),
);
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use("/api", router);

export default app;
