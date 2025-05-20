import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error("Token verification failed:", error.message);
        setError("Unable to connect to authentication server");
      } finally {
        setLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setLoading(false);
  }, []);

  // If not using persist, just render the outlet
  if (!persist) return <Outlet />;
  
  // Show loading state
  if (loading) return <Loader />;
  
  // Show error state if there's an error
  if (error) {
    return (
      <div className="bg-light h-screen grid place-items-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-sm text-gray-600">Please try again later or contact support</p>
        </div>
      </div>
    );
  }

  // Everything is good, render the outlet
  return <Outlet />;
};

export default PersistLogin;

const Loader = () => {
  return (
    <div className="bg-light h-screen grid place-items-center">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
};