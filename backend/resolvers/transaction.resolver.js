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
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          {
            new: true,
          }
        );
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
