import {
  CreateUsernameResponse,
  GraphQLContext,
  SignUpResponse,
} from "../../utils/types";
import bcrypt  from "bcrypt";

const userResolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
    signUp: async (
      _: any,
      args: { email: string; password: string },
      context: GraphQLContext
    ): Promise<SignUpResponse> => {
      const { prisma } = context;
      const userExists = await prisma.user.findUnique({
        where: {
          email: args.email,
        },
      });
      if (userExists) {
        return {
          user: { id: "", email: "", username: "", userAccessToken: "" },
          success: false,
          error: "error",
        };
      }
      const hashedPassword = await bcrypt.hash(args.password, process.env.BCRYPT_SALT as string)
      const createdUser = await prisma.user.create({
        data: {
          email: args.email,
          password: hashedPassword,
        },
      });

      return {
        user: { id: "", email: "", username: "", userAccessToken: "" },
        success: false,
        error: "error",
      };
    },
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { prisma, session } = context;
      if (!session) {
        return { error: "user is not authorized to perform this action" };
      }
      const { id } = session;
      try {
        const checkUsername = await prisma.user.findUnique({
          where: {
            username: args.username,
          },
        });
        if (checkUsername) {
          return { error: "this username already exists!" };
        }

        await prisma.user.update({
          where: {
            id,
          },
          data: {
            username: args.username,
          },
        });
        return { success: true };
      } catch (error) {
        return { error: "error" };
      }
    },
  },
};

export default userResolvers;