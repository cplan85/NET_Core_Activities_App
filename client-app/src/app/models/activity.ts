import { IProfile } from "./profile"

export type Activity = {
    id: string
    title: string
    date: Date | null
    description: string
    category: string
    city: string
    venue: string
    hostUsername?: string;
    isHost?: boolean;
    isGoing?: boolean;
    host?: IProfile;
    isCancelled?: boolean;
    attendees?: IProfile[]
  }