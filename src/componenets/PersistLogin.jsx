import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useRefresh from "../hooks/useRefresh";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefresh();
  const { auth, persist } = useAuth();
  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        console.log("🔁 Calling refresh from PersistLogin");
        await refresh();
      } catch (err) {
        console.log("Refresh token failed", err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoading]);

  useEffect(() => {
    console.log("==== PersistLogin ====");
    console.log("Persist is", persist);
    console.log("Access Token is", auth?.accessToken);
  }, [auth, persist]);

//   useEffect(() => {
//     if (!auth?.accessToken) {
//       console.log("No accessToken → calling refresh()");
//       verifyRefreshToken();
//     } else {
//       setIsLoading(false);
//     }
//   }, []);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  );
};

export default PersistLogin;
