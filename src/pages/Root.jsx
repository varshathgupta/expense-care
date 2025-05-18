import  { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "../components/utility/Loading";

function Root() {
 
  const isLoading = useSelector((state) => state.loading.isLoading);
  const sessionId = localStorage.getItem('sessionId');
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId === null) navigate("/login");
  }, []);

  if (isLoading) return <Loading loading={isLoading} />;

  return  <Outlet />;
}

export default Root;
