import React from 'react';
import { GripVertical, Trash } from 'lucide-react';

interface Props {
  active: boolean;
  onClick: () => void;
  onDelete: () => void;
  dragProps?: any;
  title: string;
  subtitle?: string;
}

const ListCard: React.FC<Props> = ({ active, onClick, onDelete, dragProps, title, subtitle }) => (
  <div
    {...dragProps}
    className={`flex items-center gap-3 p-3 border ${active ? 'border-dorren-blue bg-dorren-blue/5' : 'border-gray-200'} hover:border-dorren-blue transition-colors`}
  >
    <GripVertical size={14} className="text-gray-400 cursor-move" />
    <button className="flex-1 text-left" onClick={onClick}>
      <p className="text-sm font-semibold text-dorren-black line-clamp-1">{title || 'Без названия'}</p>
      {subtitle && <p className="text-xs text-gray-500 line-clamp-1">{subtitle}</p>}
    </button>
    <button onClick={onDelete} className="text-red-500 hover:text-red-700">
      <Trash size={14} />
    </button>
  </div>
);

export default ListCard;
