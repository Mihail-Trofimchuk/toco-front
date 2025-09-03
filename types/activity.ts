export type Activity = {
    uuid: string;
    title: string;
    description: string;
    reward: number;
    status: "pending" | "finished" | "closed" | null;
    clientUuid: string | null;
    participantUuid?: string | null;
  };