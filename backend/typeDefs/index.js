import { mergeTypeDefs } from "@graphql-tools/merge";
import { userTypeDef } from "./user.typeDef";
import { transactionTypeDef } from "./transaction.typeDef";


export const MergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef])