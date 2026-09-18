import Pusher from "pusher";
import { credentials } from "../config/credentials.js";

export const pusher = new Pusher({
  appId: credentials.pusher_app_id as string,
  key: credentials.pusher_key as string,
  secret: credentials.pusher_secret as string,
  cluster: credentials.pusher_cluster as string,
  useTLS: true,
});

export const publishTaskEvent = (
  sprintId: number,
  event: string,
  data: unknown,
) => {
  void pusher
    .trigger(`private-sprint-${sprintId}`, event, data)
    .catch((error) => {
      console.error(`Failed to publish Pusher event: ${event}`, error);
    });
};
