import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

// Configurar base URL do axios
axios.defaults.baseURL = API_BASE_URL;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = () => {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    console.log('✅ Logout concluído');
  };

  // Configurar axios com token e interceptor
  useEffect(() => {
    console.log('🔐 AuthContext: Token atual:', token ? 'Existe' : 'Não existe');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('🔐 AuthContext: Header Authorization configurado');
      loadUser();
    } else {
      console.log('🔐 AuthContext: Sem token, não carregando usuário');
      setLoading(false);
    }

    // Interceptor para capturar erros 401
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && token) {
          console.log('❌ Token inválido ou expirado. Fazendo logout...');
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [token]);

  const loadUser = async () => {
    try {
      console.log('🔐 Carregando dados do usuário...');
      const response = await axios.get('/auth/me');
      console.log('✅ Usuário carregado:', response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.error('❌ Erro ao carregar usuário:', error.response?.status, error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Tentando fazer login com:', email);
      const response = await axios.post('/auth/login', { email, password });
      console.log('✅ Login bem-sucedido, resposta:', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      console.log('✅ Token salvo e estado atualizado');
      return { success: true };
    } catch (error) {
      console.error('❌ Erro no login:', error.response?.status, error.response?.data);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao fazer login. Tente novamente.'
      };
    }
  };

  const signup = async (userData) => {
    try {
      console.log('🔐 Tentando criar conta com:', userData.email);
      const response = await axios.post('/auth/signup', userData);
      console.log('✅ Conta criada com sucesso, resposta:', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      console.log('✅ Token salvo e estado atualizado');
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao criar conta:', error.response?.status, error.response?.data);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao criar conta. Tente novamente.'
      };
    }
  };

  const updateUser = (userData) => {
    setUser({ ...user, ...userData });
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

