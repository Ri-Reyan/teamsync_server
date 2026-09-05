import AppError from "../../global/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { convertToHash } from "../../utils/argon.js";
import { RegisterPayloadType } from "./auth.interface.js";

const registeUserService = async (paylaod: RegisterPayloadType) => {
  const { username, email, password } = paylaod;

  const isExistingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isExistingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await convertToHash(password);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const verifyRegistrationOtpService = () => {};

export const authService = {
  registeUserService,
};
