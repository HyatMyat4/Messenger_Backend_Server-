import rateLimit from "express-rate-limit";
import { Log_Events } from "./Logger";

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 1 minute
  max: 4, // Limit each IP to 4 login requests per `window` per minute
  message: {
    message: "Too many login wait 5 Minute!",
  },
  handler: (req, res, next, options) => {
    Log_Events(
      `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
