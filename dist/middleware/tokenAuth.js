import jwt from "jsonwebtoken";
/**
 *
 * @param req request from express
 * @param res response object from express
 * @param next next function to pass data to next middleware
 * @param prisma prisma object to fetch user data and set them in request object
 * @returns next function to pass userData to next middleware
 */
const checkTokenAuth = async (req, res, next, prisma) => {
    try {
        //we are using bearer token to authorize users
        if (req.method === "OPTIONS")
            return next();
        const token = await req.headers.authorization?.split("")[1];
        if (token === "" || token === undefined || token === null) {
            return res
                .status(404)
                .json({ error: "user is not authorized to perform this action" });
        }
        let decodedToken;
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        if (typeof decodedToken !== "string" &&
            typeof decodedToken !== "undefined") {
            if (!decodedToken.userId) {
                throw new Error("this token does not contain a userId!");
            }
            req.userData = {
                id: decodedToken.userId,
                username: decodedToken.username,
                email: decodedToken.email,
            };
            next();
        }
    }
    catch (error) {
        return res.status(500).json({
            error: "somthing went wrong in server. please try again later!",
        });
    }
};
export default checkTokenAuth;
