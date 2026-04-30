import { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged, signOut } from "../firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  // loading = true while Firebase resolves the persisted session on page load
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // getIdToken(true) forces a refresh; false uses a cached one (valid for 1h)
        const token = await firebaseUser.getIdToken(false);
        setIdToken(token);
      } else {
        setUser(null);
        setIdToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Keep the token fresh — Firebase tokens expire after 1 hour
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      const token = await user.getIdToken(true);
      setIdToken(token);
    }, 55 * 60 * 1000); // refresh every 55 minutes
    return () => clearInterval(interval);
  }, [user]);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIdToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, idToken, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
