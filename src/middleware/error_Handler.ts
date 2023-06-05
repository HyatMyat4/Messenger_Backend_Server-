import { Log_Events } from "./Logger";

const error_Handler = (err: any, req: any, res: any, next: any) => {
  Log_Events(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "Err_Log.log"
  );
  console.log(err.stack);
  const status = res.statusCode ? res.statusCode : 500; // server error

  res.status(status);

  res.json({ message: err.message, isError: true });
};

export { error_Handler };
