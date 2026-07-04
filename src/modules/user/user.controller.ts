import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.servises";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.userServiceUserDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: {
      result,
      },
    });
})

// const registerUser = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;
//     const result = await userService.userServiceUserDB(payload);

//     res.status(httpStatus.CREATED).json({
//       success: true,
//       statusCode: httpStatus.CREATED,
//       message: "User registered successfully",
//       data: {
//         result,
//       },
//     });
//   } catch (error) {
//     ;
//   }
// };


const getMyProfile = catchAsync(async (req: Request, res: Response) => { 
  // const {accessToken} = req.cookies;
  // console.log("accessToken", accessToken); 

  // const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwtSecret);

  // if(typeof verifiedToken === "string") {
  //   throw new Error("Invalid token");
  // }
  const profile = await userService.getMyProfileFromDB(req.user?.id as string);

  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile fetched successfully",
    data: {
      profile,
    },
  });
});

const getProfileUpdate = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const payload = req.body;
  const updatedProfile = await userService.getProfileUpdateDB(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: {
      updatedProfile,
    },
  });
})



export const userController = {
  registerUser,
  getMyProfile,
  getProfileUpdate
};
