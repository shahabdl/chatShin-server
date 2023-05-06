import { Prisma } from "@prisma/client";
import { GraphQLContext } from "../../utils/types";
const conversationResolvers = {
  Query: {
    conversations: async (_: any, __: any, context: GraphQLContext) => {
      const { session, prisma } = context;
      try {
        if(!session || !session.id){
          throw new Error("user is not authorized to make new conversation");
        }
      } catch (error) {
        
      }
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { paricipantsIds: Array<string> },
      context: GraphQLContext
    ): Promise<{ conversationId: string; success: boolean; error: string }> => {
      const { prisma, session } = context;
      try {
        if (!session || !session.id) {
          throw new Error("user is not authorized to make new conversation");
        }
        const conversation = await prisma.conversation.create({
          data: {
            ConversationParticipant: {
              createMany: {
                data: args.paricipantsIds.map((id) => {
                  return { userId: id, hasSeen: id === session.id };
                }),
              },
            },
          },
          include: conversationPopulated,
        });
        console.log(conversation);

        return { conversationId: conversation.id, success: true, error: "" };
      } catch (error) {
        console.log("createConversation: ", error);
      }
      return {
        conversationId: "",
        success: false,
        error: "somthing went wrong in server",
      };
    },
  },
};

export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    uesr: {
      select: {
        id: true,
        username: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    ConversationParticipant: {
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });

export default conversationResolvers;
