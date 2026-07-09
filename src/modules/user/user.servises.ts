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
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });

  // await prisma.profile.create({
  //   data: {
  //     userId: createdUser.id,
  //     profilePhoto,
  //   },
  // });

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

const getMyProfileFromDB = async (userId: string) => {
  const profile = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
    omit: {
      password: true,
    }
  })
  return profile
};

const getProfileUpdateDB = async(userId: string, payload: any) =>{
  const {name, email,bio, profilePhoto} = payload;
  const updateUser = await prisma.user.update({
    where:{
      id: userId
    },
    data:{
      name,
      email,
      profile:{
        update:{
          profilePhoto,
          bio
        }
      }
      
    },
    omit:{
      password:true
    },
    include:{
      profile: true
    }

  })
  return updateUser;

}

export const userService = {
  userServiceUserDB,
  getMyProfileFromDB,
  getProfileUpdateDB
};
