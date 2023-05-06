import { createNewToken } from "../../utils/functions.js";
import jwt from "jsonwebtoken";
import {
  GraphQLContext,
  UserResponse,
} from "../../utils/types";
import bcrypt from "bcrypt";

const userResolvers = {
  Query: {
    searchUsers: async (_parent: any, args: "", context: GraphQLContext) => {
      const users = await context.prisma.user.findMany({ where: {} });
      return users.map((user) => {
        if (user.username) return user.username;
      });
    },
    signIn: async (
      _: any,
      args: { email: string; password: string },
      context: GraphQLContext
    ): Promise<UserResponse> => {
      const { prisma } = context;
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: args.email,
          },
        });
        if (user === null) {
          throw new Error("User Not Found!");
        }
        let passwordIsValid = false;

        passwordIsValid = await bcrypt.compare(
          args.password,
          user.password as string
        );

        if (passwordIsValid) {
          const token = createNewToken({
            userId: user.id,
            email: user.email,
            username: user.username ? user.username : "",
          });
          return {
            user: {
              id: user.id,
              email: user.email,
              username: user.username ? user.username : "",
              userAccessToken: token,
            },
            success: true,
            error: "",
          };
        } else {
          throw new Error("Wrong Password!");
        }
      } catch (error) {
        console.log(error);
        return {
          user: { id: "", email: "", username: "", userAccessToken: "" },
          success: false,
          error: "error",
        };
      }
    },
    authToken: async (
      _parent: any,
      args: { token: string },
      context: GraphQLContext
    ): Promise<UserResponse> => {
      let verifiedToken;

      try {
        verifiedToken = jwt.verify(
          args.token,
          process.env.TOKEN_SECRET as string
        );
      } catch (error) {
        return {
          user: {
            id: "",
            username: "",
            email: "",
            userAccessToken: "",
          },
          success: false,
          error: "",
        };
      }
      if (typeof verifiedToken !== "string") {
        return {
          user: {
            id: verifiedToken.userId,
            username: verifiedToken.username,
            email: verifiedToken.email,
            userAccessToken: args.token,
          },
          success: true,
          error: "",
        };
      }
      return {
        user: {
          id: "",
          username: "",
          email: "",
          userAccessToken: "",
        },
        success: false,
        error: "",
      };
    },
  },
  Mutation: {
    signUp: async (
      _: any,
      args: { email: string; password: string },
      context: GraphQLContext
    ): Promise<UserResponse> => {
      const { prisma } = context;
      const userExists = await prisma.user.findUnique({
        where: {
          email: args.email,
        },
      });
      console.log(userExists);

      if (userExists !== null) {
        return {
          user: { id: "", email: "", username: "", userAccessToken: "" },
          success: false,
          error: "User Already Exists",
        };
      }
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(args.password, salt);
      const createdUser = await prisma.user.create({
        data: {
          email: args.email,
          password: hashedPassword,
        },
      });

      let token = createNewToken({
        userId: createdUser.id,
        email: createdUser.email ? createdUser.email : "",
        username: createdUser.username ? createdUser.username : "",
      });

      return {
        user: {
          id: createdUser.id,
          email: createdUser.email ? createdUser.email : "",
          username: createdUser.username ? createdUser.username : "",
          userAccessToken: token,
        },
        success: true,
        error: "",
      };
    },
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<UserResponse> => {
      const { prisma, session } = context;
      try {
        if (!session) {
          throw new Error("user is not authorized to perform this action");
        }
        const { id } = session;
        const userExists = await prisma.user.findUnique({
          where: {
            id,
          },
        });

        if (!userExists) {
          throw new Error("User does not exist!");
        }

        const checkUsername = await prisma.user.findUnique({
          where: {
            username: args.username,
          },
        });
        console.log(checkUsername);

        if (checkUsername) {
          throw new Error("Username already exists");
        }

        const updatedUser = await prisma.user.update({
          where: {
            id,
          },
          data: {
            username: args.username,
          },
        });
        const token = createNewToken({
          userId: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username ? updatedUser.username : "",
        });
        return {
          user: {
            id: updatedUser.id,
            username: updatedUser.username ? updatedUser.username : "",
            email: updatedUser.email,
            userAccessToken: token,
          },
          success: true,
          error: "",
        };
      } catch (error) {
        console.log(error);
        return {
          user: {
            id: "",
            username: "",
            email: "",
            userAccessToken: "",
          },
          success: false,
          error: "",
        };
      }
    },
  },
};

export default userResolvers;
