import axios from "axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const { data } = await axios.get("/api/auth/refresh", {
        withCredentials: true,
      });

      setAuth(data);
      return data.accessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error.message);
      setAuth({}); // Clear auth state on refresh failure
      throw error; // Propagate error to caller for proper handling
    }
  };

  return refresh;
};

export default useRefreshToken;