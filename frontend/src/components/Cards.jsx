import { useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/query/transaction.query";

const Cards = ({profilePicture}) => {
  const { data, loading, error } = useQuery(GET_TRANSACTIONS);
  if (loading) return null;
  if (error) return `Error! ${error.message}`;

  return (
    <div className="w-full px-10 min-h-[40vh]">
      <p className="text-5xl font-bold text-center my-10">History</p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
        {data.transactions.map((transaction) => (
          <Card
            key={transaction._id}
            cardType={transaction.category}
            transaction={transaction}
            profilePicture={profilePicture}
          />
        ))}

        {/* <Card cardType={"saving"} />
				<Card cardType={"expense"} />
				<Card cardType={"investment"} />
				<Card cardType={"investment"} />
				<Card cardType={"saving"} />
				<Card cardType={"expense"} /> */}
      </div>
      {
        !loading && data.transactions.length === 0 && (
            <p className="text-center text-2xl font-bold w-full">No transactions found</p>
            )
      }
    </div>
  );
};
export default Cards;
