import AppError from "../../../../global/AppError.js";
import { prisma } from "../../../../lib/prisma.js";
import { sendEmail } from "../../../../utils/sendEmail.js";
import {
  AcceptInvitationPayloadType,
  GetInvitationPayloadType,
  SendInvitationPayloadType,
} from "./invite.interface.js";
import path from "path";
import ejs from "ejs";

const getInvitationService = async (paylaod: GetInvitationPayloadType) => {
  const user = await prisma.user.findUnique({
    where: {
      id: paylaod.user_id,
    },
  });

  if (!user) {
    throw new AppError("user not found", 400);
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: paylaod.id,
    },
  });

  if (!workspace) {
    throw new AppError("workspace dosn't exists", 400);
  }

  const isMember = await prisma.member.findUnique({
    where: {
      workspace_id_user_id: {
        workspace_id: workspace.id,
        user_id: user.id,
      },
    },
  });

  if (!isMember) {
    throw new AppError("You are not a member of this workspace", 403);
  }

  const invitations = await prisma.invitation.findMany({
    where: {
      workspace_id: workspace.id,
      status: "PENDING",
    },
  });

  return invitations;
};

const sendInvitationService = async (payload: SendInvitationPayloadType) => {
  const { workspace_id, sender_id, member_email, role } = payload;

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspace_id },
  });

  if (!workspace) {
    throw new AppError("Workspace not found", 404);
  }

  const senderMember = await prisma.member.findFirst({
    where: {
      workspace_id,
      user_id: sender_id,
      role: {
        in: ["OWNER", "ADMIN"],
      },
    },
  });

  if (!senderMember) {
    throw new AppError(
      "You do not have permission to send invitations for this workspace",
      403,
    );
  }

  const existingMember = await prisma.member.findFirst({
    where: {
      workspace_id,
      user: {
        email: member_email,
      },
    },
  });

  if (existingMember) {
    throw new AppError("User is already a member of this workspace", 400);
  }

  const existingInvitation = await prisma.invitation.findFirst({
    where: {
      workspace_id,
      member_email,
      status: "PENDING",
    },
  });

  if (existingInvitation) {
    throw new AppError(
      "An invitation has already been sent to this email",
      400,
    );
  }

  const targetUser = await prisma.user.findUnique({
    where: { email: member_email },
  });

  if (!targetUser) {
    throw new AppError("user not found", 400);
  }

  const invitation = await prisma.invitation.create({
    data: {
      sender_id,
      workspace_id,
      member_email,
      role,
      status: "PENDING",
    },
    include: {
      workspace: true,
      user: true,
    },
  });

  const clientBaseUrl = process.env.CLIENT_URL;

  const invitationLink = `${clientBaseUrl}/dashboard/accept-invitation?id=${invitation.id}`;

  const templatePath = path.join(process.cwd(), "src/views/invitation.ejs");

  const html = await ejs.renderFile(templatePath, {
    invitationLink: invitationLink,
    workspaceName: workspace.name,
    sender_id: senderMember.id,
    role: role,
  });

  await sendEmail({
    to: member_email,
    subject: `You've been invited to join ${workspace.name}`,
    html: html,
  });

  return invitation;
};

const acceptInvitationService = async (
  payload: AcceptInvitationPayloadType,
) => {
  const { id, user_id } = payload;

  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
      status: "ACTIVE",
    },
  });

  if (!user) {
    throw new AppError("user not found", 400);
  }

  const isInvitationExists = await prisma.invitation.findUnique({
    where: {
      id,
      status: "PENDING",
      member_email: user.email,
    },
  });

  if (!isInvitationExists) {
    throw new AppError("Invitation not found", 400);
  }

  const updatedInvitation = await prisma.invitation.update({
    where: {
      id,
      member_email: user.email,
    },
    data: {
      status: "ACCEPTED",
    },
  });

  return updatedInvitation;
};

export const invitationService = {
  getInvitationService,
  sendInvitationService,
  acceptInvitationService,
};
