import { Router } from "express";
import { userController } from "./user.controller";
import { Request, Response, NextFunction } from "express";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { ActiveStatus } from "../../../generated/prisma/enums";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
// import { Role } from "../../types/user.types";
const route = Router();



route.post("/register", userController.registerUser);
route.get(
  "/me",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  //     (req: Request, res: Response, next : NextFunction) => {
  //     console.log(req.cookies);
  //     const {accessToken} = req.cookies;
  //         console.log(accessToken);

  //         const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwtSecret);

  //         if(!verifiedToken.success){
  //             throw new Error(verifiedToken.error);
  //         }

  //     const { email, name, id, role } = verifiedToken.data as JwtPayload;

  //     // const requiredRoles = ["ADMIN", "USER", "AUTHOR"];
  //     const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR];

  //     if(!requiredRoles.includes(role)){
  //         return res.status(403).json({
  //             success: false,
  //             statusCode: httpStatus.FORBIDDEN,
  //             message: "Forbidden. You don't have permission to access this resource."
  //         })
  //     }

  //     req.user = {
  //         email,
  //         name,
  //         id,
  //         role
  //     };
  //     next();
  // }
  userController.getMyProfile,
);


route.put("/my-profile", auth(Role.ADMIN,Role.AUTHOR,Role.USER), userController.getProfileUpdate)

export const userRoute = route;
