import conversationResolvers from "./coversation.js";
import userResolvers from "./user.js";
import merge from "lodash.merge";

const resolvers = merge({},userResolvers, conversationResolvers);

export default resolvers;