import { Prisma, PrismaClient } from "@prisma/client";
import {
  conversationPopulated,
  participantPopulated,
} from "../graphql/resolvers/coversation";

export interface UserDataType {
  id: string;
  username: string;
  email: string;
}
export interface GraphQLContext {
  session: UserDataType;
  prisma: PrismaClient;
}

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}

export interface UserResponse {
  user: {
    id: string;
    username: string;
    email: string;
    userAccessToken: string;
  };
  success: boolean;
  error: string;
}

export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type participantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;
