import Transaction from "../models/transaction.model.js";
export const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        const user = await context.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }
        const transactions = await Transaction.find({ userId: user._id });
        return transactions;
      } catch (err) {
        console.log(err, "Error in fetching transactions");
        throw new Error("Error in fetching transactions");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (err) {
        console.log(err, "Error in fetching transaction");
        throw new Error("Error in fetching transaction");
      }
    },
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) {
        throw new Error("User not authenticated");
      }

     
      const userId = context.getUser()._id;
      const transactions = await Transaction.find({ userId });
      const categoryMap = {};
      transactions.forEach((transaction) => {
        if (categoryMap[transaction.category]) {
          categoryMap[transaction.category] += transaction.amount; 
        } else {
          categoryMap[transaction.category] = transaction.amount;
        }
      });
      console.log("categoryMap", categoryMap);
      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount,
      }));
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const user = await context.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        const newTransaction = new Transaction({
          ...input,
          userId: user._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.log(err, "error in creating transaction");
        throw new Error("Error in creating transaction");
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        console.log(input);
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          {
            new: true,
          }
        );
        console.log(updatedTransaction);
        return updatedTransaction;
      } catch (err) {
        console.error("Error updating transaction:", err);
        throw new Error("Error updating transaction");
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (err) {
        console.error("Error deleting transaction:", err);
        throw new Error("Error deleting transaction");
      }
    },
  },
};
