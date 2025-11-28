import React from 'react';

interface Props {
  label: string;
  children: React.ReactNode;
}

const Field: React.FC<Props> = ({ label, children }) => (
  <div>
    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</label>
    {children}
  </div>
);

export default Field;
