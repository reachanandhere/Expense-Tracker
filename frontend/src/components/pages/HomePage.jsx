import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, layouts } from "chart.js";

import Cards from "../Cards";
import TransactionForm from "../TransactionForm";

import { MdLogout } from "react-icons/md";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../../graphql/mutation/user.mutation";
import toast from "react-hot-toast";
import { GET_TRANSACTION_STATISTICS } from "../../graphql/query/transaction.query";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartData = {
  labels: ["Saving", "Expense", "Investment"],
  datasets: [
    {
      label: "%",
      data: [13, 8, 3],
      backgroundColor: [
        "rgba(75, 192, 192)",
        "rgba(255, 99, 132)",
        "rgba(54, 162, 235)",
      ],
      borderColor: [
        "rgba(75, 192, 192)",
        "rgba(255, 99, 132)",
        "rgba(54, 162, 235, 1)",
      ],
      borderWidth: 1,
      borderRadius: 100,
      spacing: 11,
      cutout: 130,
    },
  ],
};

const HomePage = ({ userData }) => {
  const { data } = useQuery(GET_TRANSACTION_STATISTICS);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "$",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderRadius: 100,
        spacing: 11,
        cutout: 130,
      },
    ],
  });

  useEffect(() => {
    if (data?.categoryStatistics) {
      const category = data.categoryStatistics?.map((stat) => stat.category[0].toUpperCase()+stat.category.slice(1).toLowerCase());
     
      const totalAmount = data.categoryStatistics?.map(
        (stat) => stat.totalAmount
      );
      const backgroundColor = [];
      const borderColor = [];

      category.forEach((cat) => {
        if (cat === "Saving") {
          backgroundColor.push("rgba(75, 192, 192)");
          borderColor.push("rgba(75, 192, 192)");
        } else if (cat === "Expense") {
          backgroundColor.push("rgba(255, 99, 132)");
          borderColor.push("rgba(255, 99, 132)");
        } else if (cat === "Investment") {
          backgroundColor.push("rgba(54, 162, 235)");
          borderColor.push("rgba(54, 162, 235)");
        }
      });

       setChartData(prevState=>{
        return {
         
          labels: category,
          datasets: [
            {
              ...prevState.datasets[0],
              label: "$",
              data: totalAmount,
              backgroundColor,
              borderColor,
              
            },
          ], 
        }
       })
    }
  }, [data]);

  const { profilePicture } = userData;
  const [logout, { loading, client }] = useMutation(LOGOUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const handleLogout = async () => {
    try {
      await logout();
      client.resetStore();
    } catch (err) {
      console.log(err);
      toast.error("Error logging out");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center">
        <div className="flex items-center">
          <p className="md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text">
            Spend wisely, track wisely
          </p>
          <img
            src={profilePicture}
            className="w-11 h-11 rounded-full border cursor-pointer"
            alt="Avatar"
          />
          {!loading && (
            <MdLogout
              className="mx-2 w-5 h-5 cursor-pointer"
              onClick={handleLogout}
            />
          )}
          {/* loading spinner */}
          {loading && (
            <div className="w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin"></div>
          )}
        </div>
        <div className="flex flex-wrap w-full justify-center items-center gap-6">
          <div className="h-[330px] w-[330px] md:h-[360px] md:w-[360px]  ">
            <Doughnut data={chartData} />
          </div>

          {/* <TransactionForm /> */}
        </div>
        {/* <Cards profilePicture={profilePicture} /> */}
      </div>
    </>
  );
};
export default HomePage;
