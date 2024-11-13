import { Navigate } from "react-router-dom";
import { isLoggedIn as isUserLoggedin } from "../utilities/checkAuth";
import PropTypes from "prop-types";

export default function ProtectedRoute({ Component }) {
  const isLoggedin = isUserLoggedin();

  if (!isLoggedin) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  return <Component />;
}

ProtectedRoute.propTypes = {
  Component: PropTypes.func,
};
