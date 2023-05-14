const ConversationTypeDefs = `#graphql
    scalar Date

    type Mutation {
        createConversation(paricipantsIds: [String]): Response
    }

    type Response {conversationId: Boolean, success: Boolean, error: String}

    type Conversation {
        id: String
        latestMessage: Message
        ConversationParticipant: [ConversationParticipant]
        createdAt: Date
        updatedAt: Date
    }

    type ConversationParticipant{
        id: String
        user: SearchedUser
        hasSeen: Boolean
    }

    type Query {
        conversations: [Conversation]
    }
`;

export default ConversationTypeDefs;
