// Remember if user is logged in
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

//provider component
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const value = {
    authUser,
    setAuthUser,
    loading,
    setLoading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

//Custom hook for easy consumption of the context
export const useAuth = () => {
  return useContext(AuthContext);
};
