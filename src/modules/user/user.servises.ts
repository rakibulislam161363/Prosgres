import config from "../../config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { UserPayload } from "./user.interface";



const userServiceUserDB = async(payload: UserPayload) => {
  const { name, email, password, profilePhoto } = payload; 
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (isUserExist) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password,
    Number(config.bycryptSaltRounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  await prisma.profile.create({
    data: {
      userId: createdUser.id,
      profilePhoto,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    include: {
      profile: true,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

export const userService = {
  userServiceUserDB,
};
