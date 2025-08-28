import React, { useState } from 'react';

const ChangePasswordForm: React.FC<{ onChange: (oldPassword: string, newPassword: string) => Promise<boolean> }> = ({ onChange }) => {
  const [oldP, setOldP] = useState('');
  const [newP, setNewP] = useState('');
  const [confirmP, setConfirmP] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <form onSubmit={async (e) => { e.preventDefault(); if (newP !== confirmP) { alert('New passwords do not match'); return; } setLoading(true); await onChange(oldP, newP); setLoading(false); setOldP(''); setNewP(''); setConfirmP(''); }} className="space-y-2">
      <label className="block text-sm">Current password</label>
      <input type="password" value={oldP} onChange={(e) => setOldP(e.target.value)} className="w-full p-2 border rounded" />
      <label className="block text-sm">New password</label>
      <input type="password" value={newP} onChange={(e) => setNewP(e.target.value)} className="w-full p-2 border rounded" />
      <label className="block text-sm">Confirm new password</label>
      <input type="password" value={confirmP} onChange={(e) => setConfirmP(e.target.value)} className="w-full p-2 border rounded" />
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded">{loading ? 'Saving...' : 'Change Password'}</button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
