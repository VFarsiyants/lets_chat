import { createContext, useContext, useReducer } from "react";
import { getToken } from "../services/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

function getUserId(accessToken) {
  const decoded = jwtDecode(accessToken);
  return decoded.user_id;
}

const localAuthData = localStorage.getItem("auth_data");

const initialState = {
  user: localAuthData ? getUserId(JSON.parse(localAuthData).access) : null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
      };
    case "logout":
      localStorage.removeItem("auth_data");
      return initialState;
    default:
      throw new Error("Uknown action");
  }
}

function AuthProvider({ children }) {
  const [{ user }, dispatch] = useReducer(reducer, initialState);
  async function login(email, password) {
    try {
      const authData = await getToken(email, password);
      dispatch({
        type: "login",
        payload: getUserId(authData.access),
      });
    } catch (error) {
      console.log(error);
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
