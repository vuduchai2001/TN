import { useEffect } from "react";
import { RootState } from "@/stores";
import { decodeJwt, getToken } from "@/utils/auth";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { useAppDispatch } from "@/stores/hook";
import { refreshToken } from "@/services/auth";

function ProtectedLogin({ children }: { children: JSX.Element }) {
  const { isLogin } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const dispatch = useAppDispatch();
  useEffect(() => {
    const refreshTokenInterval = setInterval(() => {
      const token = getToken();
      if (token?.accessToken && token?.refreshToken) {
        const tokenDecode: any = decodeJwt(token?.accessToken ?? "");
        const now = dayjs().subtract(1, "minute");
        if (tokenDecode && now.unix() > tokenDecode?.exp) {
          refreshToken(token.refreshToken ?? "");
        }
      }
    }, 10000);
    return () => {
      clearInterval(refreshTokenInterval);
    };
  }, [dispatch]);

  if (!isLogin) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }

  return children;
}
export default ProtectedLogin;
