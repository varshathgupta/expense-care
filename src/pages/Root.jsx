import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "../components/utility/Loading";

function Root() {
  const isLoggedIn = useSelector((state) => state.auth.userId);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isLoggedIn) navigate("/login");
  // }, []);

  if (isLoading) return <Loading loading={isLoading} />;

  return  <Outlet />;
}

export default Root;
