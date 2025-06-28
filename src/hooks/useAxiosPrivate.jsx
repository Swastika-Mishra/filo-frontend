import { axiosPrivate } from "../api/axios";
import useRefresh from "./useRefresh";
import useAuth from "./useAuth";
import { useEffect } from "react";

const useAxiosPrivate = () => {
  const refresh = useRefresh();
  const { auth, setAuth } = useAuth();
  useEffect(() => {
    //if (!auth?.accessToken) return;
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"] && auth?.accessToken) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevReq = error?.config;
        if (
          (error?.response?.status === 403 ||
            error?.response?.status === 401) &&
          !prevReq?.sent
        ) {
          prevReq.sent = true;
          if (prevReq.url.includes("/auth/refresh")) {
            console.warn("Refresh endpoint itself failed — aborting retry");
            return Promise.reject(error);
          }
          try {
            const newAccessToken = await refresh();
            prevReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevReq);
          } catch (err) {
            console.log("Refresh failed inside interceptor");
            setAuth({});
            return Promise.reject(error);
          }
        }
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth?.accessToken, refresh, setAuth]);

  return axiosPrivate;
};
export default useAxiosPrivate;
