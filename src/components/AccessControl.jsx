import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn as isUserLoggedin } from "../utilities/checkAuth";
import PropTypes from "prop-types";

export default function AccessControl({ children }) {
  const location = useLocation();
  const publicRoutesToRestrict = ["/login", "/signup"]; // Routes that are protected if user already loggedin
  const isLoggedIn = isUserLoggedin();

  if (isLoggedIn && publicRoutesToRestrict.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

AccessControl.propTypes = {
  children: PropTypes.any,
};
