import React, { useState } from 'react';

const LoginForm: React.FC<{ onSubmit: (email: string, password: string) => Promise<void>, error?: string | null }> = ({ onSubmit, error }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <form onSubmit={async (e) => { e.preventDefault(); setLoading(true); await onSubmit(email, pass); setLoading(false); }} className="space-y-3">
      <label className="block text-sm">Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" />
      <label className="block text-sm">Password</label>
      <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full p-2 border rounded" />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">{loading ? 'Logging in...' : 'Login'}</button>
      </div>
    </form>
  );
};

export default LoginForm;
