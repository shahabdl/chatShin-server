import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 *
 * @param req request from express
 * @param res response object from express
 * @param next next function to pass data to next middleware
 * @param prisma prisma object to fetch user data and set them in request object
 * @returns next function to pass userData to next middleware
 */
const Session = async (
  req: Request,
  res: Response,
  next: NextFunction,
  prisma: PrismaClient
) => {
  try {
    //we are using bearer token to authorize users
    if (req.method === "OPTIONS") return next();
    
    const token = await req.headers.authorization?.split(" ")[1];
    
    if (token === "" || token === undefined || token === null) {
      return next();
    }

    let decodedToken;
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as string);

    if (
      typeof decodedToken !== "string" &&
      typeof decodedToken !== "undefined"
    ) {
      if (!decodedToken.userId) {
        return next();
      }
      req.userData = {
        id: decodedToken.userId,
        username: decodedToken.username,
        email: decodedToken.email,
      };
      next();
    }
  } catch (error) {
    return res.status(500).json({
      error: "somthing went wrong in server. please try again later!",
    });
  }
};

export default Session;
