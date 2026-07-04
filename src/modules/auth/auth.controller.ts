import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.servises";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const authControllerInDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = req.body;

    const { accessToken, refreshToken } = await authService.authServicesDB(payload); 

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: { accessToken, refreshToken }
    });

});

const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;

    const { accessToken } = await authService.refreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24,
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Access token refreshed successfully",
        data: { accessToken }
    });

});

export const authController = {
  authControllerInDB,
  refreshToken
};