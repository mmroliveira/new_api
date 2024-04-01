import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticateUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ message: "Token missing" });
  }

  const [, token] = authHeader.split(" ");

  const jwt_token_secret = process.env.JWT_SECRET;

  if (!jwt_token_secret) {
    return response.status(500).json({ message: "Internal error server" });
  }

  try {
    const { sub } = verify(token, jwt_token_secret) as IPayload;

    request.user_id = sub;

    return next();
  } catch (error) {
    return response.status(401).json({ message: "Invalid token" });
  }
}
