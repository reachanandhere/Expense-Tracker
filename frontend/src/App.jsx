import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/pages/LoginPage";
import SignUpPage from "./components/pages/SignUpPage";
import TransactionPage from "./components/pages/TransactionPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import Header from "./components/UI/Header";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/query/user.query";
import { Toaster } from "react-hot-toast";

function App() {
  const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER);
	//console.log(data.authUser.profilePicture)
  if (loading) return null
  console.log(data)
  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route
          path="/"
          element={data?.authUser ? <HomePage userData={data?.authUser} /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!data?.authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!data?.authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/transaction/:id"
          element={data?.authUser ? <TransactionPage /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}
export default App;
