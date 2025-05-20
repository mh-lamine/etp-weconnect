import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    // Mock implementation that returns dummy access token
    const mockData = {
      accessToken: 'mock_token',
      role: 'SALON',
      id: 'mock_user_id',
      email: 'mock@example.com',
      defaultPaymentOption: 'DEPOSIT',
      defaultDeposit: 30,
      stripeConnectedAccountId: 'mock_stripe_id'
    };
    setAuth(mockData);
    return mockData.accessToken;
  };

  return refresh;
};

export default useRefreshToken;