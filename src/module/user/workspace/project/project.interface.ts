export type GetProjectPayloadType = {
  workspaceId: string;
  userId: string;
};

export type CreateProjectPayloadType = {
  workspaceId: string;
  userId: string;
  name: string;
  description: string;
};
