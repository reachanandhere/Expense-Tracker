import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutation/transaction.mutution";
import toast from "react-hot-toast";

const categoryColorMap = {
  saving: "from-green-700 to-green-400",
  expense: "from-pink-800 to-pink-600",
  investment: "from-blue-700 to-blue-400",
  // Add more categories and corresponding color classes as needed
};

const Card = ({ cardType, transaction, profilePicture }) => {
  let { description, paymentType, category, location } = transaction
    const [deleteTransaction, { loading, error }] = useMutation(DELETE_TRANSACTION, {
        refetchQueries: ["GetTransactions"],
    })
  const cardClass = categoryColorMap[cardType];
  const dateOption = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }  


  description = transaction.description[0].toUpperCase() + transaction.description.slice(1)
  paymentType = transaction.paymentType[0].toUpperCase() + transaction.paymentType.slice(1)
  category = transaction.category[0].toUpperCase() + transaction.category.slice(1)

  const handleDeleteTransaction = async () => {
    try {
      await deleteTransaction({
        variables: {
            transactionId: transaction._id,
        },
      });
      toast.success("Transaction deleted successfully");
    } catch (err) {
      console.log(err);
    }
  }

  const formattedDate = new Date(parseInt(transaction.date)).toLocaleDateString("en-US", dateOption);
  return (
    <div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {cardType[0].toUpperCase() + cardType.slice(1)}
          </h2>
          <div className="flex items-center gap-2">
            <FaTrash className={"cursor-pointer"}  onClick={handleDeleteTransaction}/>
            <Link to={`/transaction/${transaction._id}`}>
              <HiPencilAlt className="cursor-pointer" size={20} />
            </Link>
          </div>
        </div>
        <p className="text-white flex items-center gap-1">
          <BsCardText />
          Description: {description}
        </p>
        <p className="text-white flex items-center gap-1">
          <MdOutlinePayments />
          Payment Type: {paymentType}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaSackDollar />
          Amount: {transaction.amount}
        </p>
        <p className="text-white flex items-center gap-1">
          <FaLocationDot />
          Location: {location}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xs text-black font-bold">{formattedDate}</p>
          <img
            src={profilePicture}
            className="h-8 w-8 border rounded-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
export default Card;
