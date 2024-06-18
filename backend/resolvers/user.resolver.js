import { users } from "../DummyData/data.js";
export const userResolver = {
  Query: {
    users: () => users,
    user: (_, { userId }) => {
      return users.find((user) => user._id == userId);
    },
  },
  Mutation: {},
};
