import { Outlet } from "react-router-dom";
import AlertContext from "./context/useAlert";
import AccessControl from "./components/AccessControl";

import "./App.css";

function App() {
  return (
    <AlertContext>
      <AccessControl>
        <Outlet />
      </AccessControl>
    </AlertContext>
  );
}

export default App;
