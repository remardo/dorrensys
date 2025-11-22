import React, { useState } from 'react';
import { requestAuthCode, verifyAuthCode } from '../convexClient';

interface AuthWidgetProps {
  token: string | null;
  email: string | null;
  onAuth: (token: string, email: string) => void;
  onLogout: () => void;
}

const AuthWidget: React.FC<AuthWidgetProps> = ({ token, email, onAuth, onLogout }) => {
  const [inputEmail, setInputEmail] = useState(email ?? '');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!inputEmail) return setMessage('Введите email');
    setLoading(true);
    try {
      const respCode = await requestAuthCode(inputEmail);
      setMessage(respCode ? `Код отправлен (dev: ${respCode})` : 'Код отправлен');
    } catch (e: any) {
      setMessage(e?.message ?? 'Ошибка запроса кода');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!inputEmail || !code) return setMessage('Введите email и код');
    setLoading(true);
    try {
      const authResult = await verifyAuthCode(inputEmail, code);
      const token = authResult.token;
      if (token) {
        onAuth(token, inputEmail);
        setMessage('Успешный вход');
        setCode('');
      } else {
        setMessage('Не удалось авторизоваться');
      }
    } catch (e: any) {
      setMessage(e?.message ?? 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return (
      <div className="flex flex-col items-end text-xs text-gray-700">
        <span className="font-semibold">Вход: {email}</span>
        <button onClick={onLogout} className="text-dorren-blue hover:underline mt-1">
          Выйти
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      <input
        type="email"
        value={inputEmail}
        onChange={(e) => setInputEmail(e.target.value)}
        placeholder="email@company.com"
        className="border border-gray-200 px-2 py-1 text-xs"
      />
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Код"
        className="border border-gray-200 px-2 py-1 text-xs w-20"
      />
      <button
        onClick={handleRequest}
        disabled={loading}
        className="px-2 py-1 border text-xs uppercase tracking-wider border-dorren-dark text-dorren-dark hover:bg-dorren-dark hover:text-white transition-colors"
      >
        Код
      </button>
      <button
        onClick={handleVerify}
        disabled={loading}
        className="px-2 py-1 border text-xs uppercase tracking-wider border-dorren-dark text-dorren-dark hover:bg-dorren-dark hover:text-white transition-colors"
      >
        Войти
      </button>
      {message && <span className="text-gray-500">{message}</span>}
    </div>
  );
};

export default AuthWidget;

