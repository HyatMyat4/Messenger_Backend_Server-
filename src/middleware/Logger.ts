import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import fsPromises from "fs/promises";

const Log_Events = async (message: string, logFileName: any) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");

  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req: any, res: any, next: any) => {
  Log_Events(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};

export { Log_Events, logger };
