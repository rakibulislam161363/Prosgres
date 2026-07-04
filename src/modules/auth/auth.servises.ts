import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { ILoginUser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

const authServicesDB = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
    },
  });

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Password does not match");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwtSecret,
    config.jwtExpiration as SignOptions,
  );

  //  jwt.sign(jwtPayload,config.jwtSecret, {expiresIn: config.jwtExpiration} as jwt.SignOptions);

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwtRefreshSecret,
    config.jwtRefreshExpiration as SignOptions,
  );

  //  jwt.sign(jwtPayload,config.jwtRefreshSecret, {expiresIn: config.jwtRefreshExpiration} as jwt.SignOptions);

  return { accessToken, refreshToken };
};

const refreshToken = async (refreshToken: string) => {

  const verifiedToken = jwtUtils.verifyToken(refreshToken, config.jwtRefreshSecret);

  if (!verifiedToken.success) {
    throw new Error("Invalid refresh token");
  }

  const {id} = verifiedToken.data as jwt.JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    }
  })

  if(user.activeStatus === "INACTIVE"){
    throw new Error("User is inactive");
  };

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwtSecret,
    config.jwtExpiration as SignOptions,
  );

  return{ accessToken }
}

export const authService = {
  authServicesDB,
  refreshToken
};
