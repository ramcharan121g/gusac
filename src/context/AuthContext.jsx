import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reAuthRequest, setReAuthRequest] = useState(null); // { actionName, onSuccess, onCancel }

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = localStorage.getItem('gusac_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await apiRequest('/auth/me');
      if (data.authenticated) {
        setUser(data.user);
        localStorage.setItem('gusac_user', JSON.stringify(data.user));
      } else {
        setUser(null);
        localStorage.removeItem('gusac_token');
        localStorage.removeItem('gusac_user');
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('gusac_token');
      localStorage.removeItem('gusac_user');
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    if (data.mfaRequired) {
      return {
        mfaRequired: true,
        mfaTempToken: data.mfaTempToken,
        user: data.user,
        demoTotpCode: data.demoTotpCode,
        message: data.message
      };
    }

    localStorage.setItem('gusac_token', data.token);
    localStorage.setItem('gusac_user', JSON.stringify(data.user));
    setUser(data.user);
    return { success: true, user: data.user };
  }

  async function verifyMfa(mfaTempToken, code) {
    const data = await apiRequest('/auth/mfa/verify', {
      method: 'POST',
      body: { mfaTempToken, code }
    });

    localStorage.setItem('gusac_token', data.token);
    localStorage.setItem('gusac_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  async function register(userData) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: userData
    });

    if (data.token) {
      localStorage.setItem('gusac_token', data.token);
      localStorage.setItem('gusac_user', JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  }

  async function logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('gusac_token');
      localStorage.removeItem('gusac_user');
      setUser(null);
    }
  }

  // Helper to trigger sensitive action re-authentication challenge
  function requestReAuth(actionName, onSuccess, onCancel) {
    setReAuthRequest({ actionName, onSuccess, onCancel });
  }

  function closeReAuth() {
    if (reAuthRequest?.onCancel) reAuthRequest.onCancel();
    setReAuthRequest(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        verifyMfa,
        register,
        logout,
        checkAuth,
        requestReAuth,
        reAuthRequest,
        closeReAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
