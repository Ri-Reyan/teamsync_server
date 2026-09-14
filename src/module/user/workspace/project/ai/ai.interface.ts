export type TaskType = {
  status: string;
  title: string;
  description: string;
};

export type PreviousConversationType = {
  topic: string;
  result: string;
};

export type GenPreviouConversationSummary = PreviousConversationType;

export type GetConversationType = {
  workspaceId: string;
  projectId: string;
  userId: string;
};
