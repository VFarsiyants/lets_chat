import { createContext, useContext, useReducer } from "react";
import { getToken } from "../services/api";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: !!localStorage.getItem("auth_data"),
};

function reducer(state, action) {
  console.log(localStorage.getItem("auth_data"));
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "logout":
      localStorage.removeItem("auth_data");
      return initialState;
    default:
      throw new Error("Uknown action");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );
  async function login(email, password) {
    try {
      const response = await getToken(email, password);
      dispatch({
        type: "login",
        payload: email,
      });
    } catch (error) {
      console.log(error);
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
