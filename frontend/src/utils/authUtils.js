export const setUserToLocalStorage = (user) => {
  return localStorage.setItem('user', JSON.stringify(user));
};

export const removeUserFromLocalStorage = () => {
  return localStorage.removeItem('user');
};

export const getUserFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('user')) || null;
};

export const getAuthTokenFromLocalStorage = () => {
  const user = getUserFromLocalStorage();

  return user?.token;
};
