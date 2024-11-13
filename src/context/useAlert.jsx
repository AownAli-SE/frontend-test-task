import { createContext } from "react";
import { message } from "antd";
import PropTypes from "prop-types";

export const alertContext = createContext(null);

export default function AlertContext({ children }) {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <alertContext.Provider value={messageApi}>
      {contextHolder}
      {children}
    </alertContext.Provider>
  );
}

AlertContext.propTypes = {
  children: PropTypes.any,
};
