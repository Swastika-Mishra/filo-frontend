import { axiosPrivate } from "../api/axios";
import useRefresh from "./useRefresh";
import useAuth from "./useAuth";
import { useEffect } from "react";

const useAxiosPrivate = () =>{
    const refresh = useRefresh();
    const {auth} = useAuth();
    useEffect(()=>{
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config =>{
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            } , (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) =>{
                const prev = error?.config;
                if(error?.response?.status === 403 && !prev?.sent){
                    prev.sent = true;
                    const newAccessToken = await refresh();
                    prev.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prev);
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh]);
    
    return axiosPrivate;
}
export default useAxiosPrivate;