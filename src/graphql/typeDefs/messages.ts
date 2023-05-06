const typedefs = `#graphql
    type Message {
        id: String
        sender: SearchedUser
        body: String
        createdAt: Date
    }
`;

export default typedefs