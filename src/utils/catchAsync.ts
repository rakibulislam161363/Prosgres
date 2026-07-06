import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
export const catchAsync = (fn: RequestHandler) =>{
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
    //   res.status(httpStatus.BAD_REQUEST).json({
    //   success: false,
    //   statusCode: httpStatus.BAD_REQUEST,
    //   message: "Failed to register user",
    //   data: null,
    //   error: error.message
    // })
    next(error)
    }
  }
};