import jwt from "jsonwebtoken";
interface PropsType {
  userId: string;
  email: string;
  username: string;
}

export const createNewToken = ({ userId, email, username }: PropsType) => {
  let token;
  try {
    token = jwt.sign(
      { userId, email, username },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "10d" }
    );
    return token;
  } catch (error) {
    console.log(error);
    return ""
  }
};
