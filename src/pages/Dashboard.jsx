import { useState } from "react";
import "./Dashboard.css";
import File from "../componenets/File";
import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";

function Dashboard(){
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () =>{
    await logout();
    navigate('/');
  }
  return (
    <>
      <div>
        <button onClick={signOut}>Logout</button>
      </div>
      <File />
    </>
  );
};
export default Dashboard;