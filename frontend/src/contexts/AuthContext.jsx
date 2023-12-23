import { createContext, useContext, useReducer } from "react";
import { getToken } from "../services/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

function getUserId() {
  const localAuthData = localStorage.getItem("auth_data");
  const decoded = localAuthData
    ? jwtDecode(JSON.parse(localAuthData).access)
    : null;
  return decoded?.user_id;
}

function getLocalUserInfo() {
  return {
    user: getUserId(),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return getLocalUserInfo();
    case "logout":
      localStorage.removeItem("auth_data");
      return getLocalUserInfo();
    case "refresh":
      return getLocalUserInfo();
    case "connect":
      return { ...state, userInfo: action.payload };
    default:
      throw new Error("Uknown action");
  }
}

function AuthProvider({ children }) {
  const [{ user, userInfo }, dispatch] = useReducer(
    reducer,
    getLocalUserInfo()
  );
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

  function setCurrentUser(userInfo) {
    dispatch({
      type: "connect",
      payload: userInfo,
    });
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, setCurrentUser, userInfo }}
    >
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
