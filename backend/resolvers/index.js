import { mergeResolvers } from "@graphql-tools/merge";
import { userResolver } from "./user.resolver";
import { transactionResolver } from "./transaction.resolver";

export const mergedResolver = mergeResolvers([userResolver, transactionResolver])