import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar sesión al cargar la aplicación
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = authService.getToken();
        const userData = authService.getUserData();

        if (token && userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error al inicializar autenticación:", error);
        // Limpiar datos corruptos
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);

      // Guardar en localStorage
      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Actualizar estado
      setUser(response.user);

      return response;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user && !!authService.getToken();
  };

  const updateUser = (updatedUserData) => {
    // Actualizar el estado local
    setUser(updatedUserData);

    // Actualizar localStorage
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
