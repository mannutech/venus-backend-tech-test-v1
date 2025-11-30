import pino from "pino";

export type Logger = pino.Logger;

export function createLogger(name?: string): Logger {
  const isProduction = process.env.NODE_ENV === "production";
  const isTest = process.env.NODE_ENV === "test";

  return pino({
    name: name || "tvl-api",
    level: isTest ? "silent" : isProduction ? "info" : "debug",
    transport: isProduction
      ? undefined
      : {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
  });
}
