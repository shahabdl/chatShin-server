import { error } from "console";
import { createNewToken } from "../../utils/functions.js";
import {
  CreateUsernameResponse,
  GraphQLContext,
  SignUpResponse,
} from "../../utils/types";
import bcrypt from "bcrypt";

const userResolvers = {
  Query: {
    searchUsers: () => {},
    signIn: async (
      _: any,
      args: { email: string; password: string },
      context: GraphQLContext
    ): Promise<SignUpResponse> => {
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
    ): Promise<CreateUsernameResponse> => {
      const { prisma, session } = context;
      
      if (!session) {
        return { error: "user is not authorized to perform this action" };
      }
      const { id } = session;
      const userExists = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      console.log(id);
      console.log(userExists);
      
      if(!userExists){
        return {error:"user does not exists!"}
      }
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
