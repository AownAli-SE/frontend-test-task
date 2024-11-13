export const ENDPOINTS = {
  SIGNUP: getFullUrl("/auth/signup"),
  LOGIN: getFullUrl("/auth/login"),
  FORGET_PASSWORD: getFullUrl("/auth/forget-password"),
  CHANGE_PASSWORD: getFullUrl("/auth/change-password"),
  ME: getFullUrl("/auth/me"),
  UPDATE_ME: getFullUrl("/auth/me/update"),

  READ_WRITE_CATEGORIES: getFullUrl("/categories"),
  READ_WRITE_CATEGORY_BY_ID: getFullUrl("/categories/:id"),

  READ_WRITE_CARS: getFullUrl("/cars"),
  READ_WRITE_CARS_BY_ID: getFullUrl("/cars/:id"),
};

// Helper methods
function getFullUrl(endpoint) {
  return import.meta.env.VITE_API_URL + endpoint;
}
