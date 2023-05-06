const ConversationTypeDefs = `#graphql
    scalar Date

    type Mutation {
        createConversation(paricipantsIds: [String]): Response
    }
    type Response {conversationId: Boolean, success: Boolean, error: String}

    type Conversation {
        id: String
        #latestMessage: Message
        participants: [Participants]
        createdAt: Date
        updatedAt: Date
    }

    type Participants{
        id: String
        user: User
        hasSeenLatestMessage: Boolean
    }

    type Query {
        conversations: [Conversation]
    }
`;

export default ConversationTypeDefs;
