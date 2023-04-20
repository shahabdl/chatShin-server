const userTypeDefs = `#graphql
    type User {
        id: String
        username: String
    }

    type Query {
        searchUsers(username: String): [User]
    }

    type Mutation {
        signUp(email: String, password: String): SignUpResponse
        createUsername(username: String): CreateUsernameResponse
    }

    type CreateUsernameResponse { success: Boolean, error: String}
    type SignUpResponse { user: SignUpUserType, success: Boolean, error: String}
    type SignUpUserType {id: String, email: String, username: String, userAccessToken: String}
`;

export default userTypeDefs;
