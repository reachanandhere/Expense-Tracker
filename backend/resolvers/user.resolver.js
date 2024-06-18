import { users } from "../DummyData/data.js";
export const userResolver = {
  Query: {
    users: () => users,
  },
  Mutation: {},
};
