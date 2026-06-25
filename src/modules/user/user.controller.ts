import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.servises";

const registerUser = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = await userService.userServiceUserDB(payload);

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: {
        result,
      },
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Failed to register user",
      data: null,
    });
  }
};

export const userController = {
  registerUser,
};
