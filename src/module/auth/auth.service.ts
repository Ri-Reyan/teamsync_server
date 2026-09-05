import { prisma } from "../../lib/prisma.js";

type RegisterPayloadType = {
  username: string;
  email: string;
  password: string;
};

const registeUserService = async (paylaod: RegisterPayloadType) => {
  const { username, email, password } = paylaod;

  const isExistingUser = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const user = await prisma.user.create({
    data: {
      username,
      email,
    },
  });
};

export const authService = {
  registeUserService,
};
