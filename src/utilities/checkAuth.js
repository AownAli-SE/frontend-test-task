import { decrypt } from "./encryption";

export const isLoggedIn = (getToken = false) => {
  const token = localStorage.getItem("test_token");
  if (!token) return false;

  const decryptedToken = decrypt(token);
  if (!decryptedToken) return false;

  return getToken ? decryptedToken : true;
};
