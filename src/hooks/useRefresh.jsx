import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";

const useRefresh = () => {
    console.log("🧠 useRefresh called");
  const { setAuth } = useAuth();
  const refresh = async () => {
    try {
      const response = await axiosPrivate.get("/auth/refresh", {
        //withCredentials: true,
      });
      const accessToken = response?.data?.accessToken;
      setAuth((prev) => {
        console.log(JSON.stringify(prev));
        console.log(response.data.accessToken);
        return { ...prev, accessToken: response.data.accessToken };
      });
      return accessToken;
    } catch (err) {
      console.log("Refresh failed", err);
      throw err;
    }
  };
  return refresh;
};

export default useRefresh;
