import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AllTransactions from "./pages/AllTransactions";
import Charts from "./pages/Charts";
import Error from "./components/Error";
import SignupVerification from "./pages/SignupVerification";
import Help from "./pages/Help";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const router = createBrowserRouter([
    {
      path: "/signup",
      Component: Signup,
    },
    {
      path: "/login",
      Component: Login,
    },
    {
      path: "/help",
      Component: Help,
    },
   
    {
      path: "/signup-verification",
      Component: SignupVerification,
    },
    {
      path: "/forgot-password",
      Component: ForgotPassword,
    },
    {
      path: "/reset-password",
      Component: ResetPassword,
    },
    {
      path: "/",
      Component: Root,
      errorElement: <Error />,
      children: [
        {
          index: true,
          Component: Dashboard,
        },
        {
          path: "dashboard",
          Component: Dashboard,
        },
        {
          path: "all-transactions",
          Component: AllTransactions,
        },
        {
          path: "charts",
          Component: Charts,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
