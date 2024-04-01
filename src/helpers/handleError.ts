import { NextFunction, Request, Response } from "express";

const handleError = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.handleError = function (message, status) {
    return this.status(status).send({ message });
  };
  next();
};

export { handleError };
