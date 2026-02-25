import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || '');
  const [currentUser, setCurrentUser] = useState(() => {
    const value = localStorage.getItem('currentUser');
    return value ? JSON.parse(value) : null;
  });

  const login = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  };

  const loginUser = ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem('platformUsers') || '[]');
    const matched = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

    if (!matched || matched.password !== password) {
      return { ok: false, message: 'Email ou mot de passe invalide.' };
    }

    const generatedUserToken = `user-${Date.now()}`;
    const safeUser = {
      firstName: matched.firstName,
      lastName: matched.lastName,
      email: matched.email,
      phone: matched.phone,
    };

    localStorage.setItem('userToken', generatedUserToken);
    localStorage.setItem('currentUser', JSON.stringify(safeUser));
    setUserToken(generatedUserToken);
    setCurrentUser(safeUser);

    return { ok: true };
  };

  const registerUser = ({ firstName, lastName, email, phone, password }) => {
    const users = JSON.parse(localStorage.getItem('platformUsers') || '[]');
    const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      return { ok: false, message: 'Un compte existe déjà avec cet email.' };
    }

    const newUser = { firstName, lastName, email, phone, password, createdAt: new Date().toISOString() };
    localStorage.setItem('platformUsers', JSON.stringify([...users, newUser]));

    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    setToken('');
    setUserToken('');
    setCurrentUser(null);
  };

  const logoutUser = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    setUserToken('');
    setCurrentUser(null);
  };

  const isAdminAuthenticated = Boolean(token);
  const isUserAuthenticated = Boolean(userToken);
  const isAuthenticated = isAdminAuthenticated || isUserAuthenticated;

  const value = useMemo(
    () => ({
      token,
      userToken,
      currentUser,
      isAuthenticated,
      isAdminAuthenticated,
      isUserAuthenticated,
      login,
      loginUser,
      registerUser,
      logout,
      logoutUser,
    }),
    [token, userToken, currentUser, isAuthenticated, isAdminAuthenticated, isUserAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
