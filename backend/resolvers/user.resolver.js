import { users } from "../DummyData/data.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
export const userResolver = {
  Query: {
    authUser: async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user;
      } catch (err) {
        console.log(err, "Error in authUser");
        throw new Error("Error in authUser");
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        return user;
      } catch (err) {
        console.log(err, "Error in fetching user");
        throw new Error("Error in fetching user");
      }
    },
  },
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }

        const isUserExist = users.find((user) => user.username === username);
        if (isUserExist) {
          throw new Error("User already exist");
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profilePicture =
          gender === "male"
            ? process.env.GENDER_MALE
            : process.env.GENDER_FEMALE;
        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture,
        });
        await newUser.save();
        await context.login(newUser);
        return newUser;
      } catch (err) {
        console.log(err, "error in SignUp");
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if (!username || !password) {
          throw new Error("All fields are required");
        }

        const { user } = await context.authenticate("graphql-local", {
          username,
          password,
        });
        await context.login(user);
        return user;
      } catch (err) {
        console.log(err, "Error in login");
      }
    },

    logout: async (_, __, context) => {
      try {
        await context.logout();
        req.savedSession.destroy((err) => {
          if (err) throw err;
        });
        res.clearCookie("connect.sid");
        return { message: "Logged out successfully" };
      } catch (err) {
        console.log(err, "Error in logout");
      }
    },
  },
};
