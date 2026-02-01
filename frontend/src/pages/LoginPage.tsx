import React, { useEffect } from 'react';
import keycloak from '../keycloak';


const LoginPage: React.FC = () => {
  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-80 text-center">
        <h2 className="text-2xl font-bold mb-6">Redirecting to login...</h2>
      </div>
    </div>
  );
};

export default LoginPage;
