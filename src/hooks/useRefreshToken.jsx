import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    // Mock implementation that returns dummy access token
    const mockData = {
      accessToken: 'mocked_access_token',
      role: 'SALON',
      id: 'mocked_user_id'
    };
    setAuth(mockData);
    return mockData.accessToken;
  };

  return refresh;
};

export default useRefreshToken;