import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: 'mock_token',
    role: 'SALON',
    id: 'mock_user_id',
    email: 'mock@example.com',
    defaultPaymentOption: 'DEPOSIT',
    defaultDeposit: 30,
    stripeConnectedAccountId: 'mock_stripe_id'
  });
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;