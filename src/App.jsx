import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AllTransactions from "./pages/AllTransactions";
import Charts from "./pages/Charts";
import Error from "./components/Error";
import Help from "./pages/Help";


function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      Component: Login,
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
        {
          path: "help",
          Component: Help,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
