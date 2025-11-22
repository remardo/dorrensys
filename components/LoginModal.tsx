import React, { useState } from 'react';
import { Mail, LogIn, X, ArrowRight, Loader2, Shield } from 'lucide-react';
import { requestAuthCode, verifyAuthCode } from '../convexClient';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onAuth: (token: string, email: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onAuth }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const requestCode = async () => {
    if (!email) {
      setMessage('Введите email');
      return;
    }
    setLoading(true);
    try {
      const resp = await requestAuthCode(email);
      setMessage(resp ? `Код отправлен (dev: ${resp})` : 'Код отправлен на почту');
    } catch (e: any) {
      setMessage(e?.message ?? 'Ошибка запроса кода');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!email || !code) {
      setMessage('Введите email и код');
      return;
    }
    setLoading(true);
    try {
      const authResult = await verifyAuthCode(email, code);
      const token = authResult.token;
      if (token) {
        onAuth(token, email);
        setMessage('Вы успешно вошли');
        onClose();
      } else {
        setMessage('Не удалось авторизоваться');
      }
    } catch (e: any) {
      setMessage(e?.message ?? 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded shadow-xl p-6 space-y-4 relative">
        <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-dorren-blue" />
          <h3 className="text-lg font-semibold text-dorren-black">Вход в портал</h3>
        </div>
        <p className="text-sm text-gray-600">Выберите способ входа: по email-коду или через Google.</p>

        <div className="space-y-3 border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail size={16} /> Вход по email
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@company.com"
            className="w-full border border-gray-200 px-3 py-2 text-sm"
          />
          <div className="flex gap-2 items-center">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Код из письма"
              className="flex-1 border border-gray-200 px-3 py-2 text-sm"
            />
            <button
              onClick={requestCode}
              disabled={loading}
              className="px-3 py-2 border text-xs uppercase tracking-wider border-dorren-dark text-dorren-dark hover:bg-dorren-dark hover:text-white transition-colors"
            >
              Код
            </button>
          </div>
          <button
            onClick={verifyCode}
            disabled={loading}
            className="w-full bg-dorren-dark text-white py-2 text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-colors"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />} Войти
          </button>
          {message && <p className="text-xs text-gray-500">{message}</p>}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">или</p>
          <button
            onClick={() => alert('OAuth Google требует настройки Convex auth; поставьте редирект на ваш провайдер.')}
            className="w-full border border-gray-200 py-2 text-sm font-medium flex items-center justify-center gap-2 hover:border-dorren-blue"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-4 h-4" />
            Войти через Google
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

