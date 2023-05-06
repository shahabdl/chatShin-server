const userTypeDefs = `#graphql
    type User {
        id: String
        password: String
        email: String
        username: String
        image: String
    }

    type SearchedUser {
        id: String
        username: String
    }

    type Query {
        searchUsers: [String]
        signIn(email: String, password: String): UserResponse
        authToken(token: String): UserResponse
    }

    type Mutation {
        signUp(email: String, password: String): UserResponse
        createUsername(username: String): UserResponse
    }

    type UserResponse { user: SignUpUserType, success: Boolean, error: String}
    type SignUpUserType {id: String, email: String, username: String, userAccessToken: String}
`;

export default userTypeDefs;
