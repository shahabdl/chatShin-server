import { PrismaClient } from "@prisma/client";

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

export interface SignUpResponse {
  user: {
    id: string;
    username: string;
    email: string;
    userAccessToken: string;
  };
  success: boolean;
  error: string;
}
