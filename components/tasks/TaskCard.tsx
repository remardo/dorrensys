import React, { useState } from 'react';
import { MoreHorizontal, UserPlus } from 'lucide-react';
import { Task, User } from '../../types';

const priorityLabels: Record<Task['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

interface Props {
  task: Task;
  onClick: () => void;
  onAssign: (user?: User) => void;
}

const TaskCard: React.FC<Props> = ({ task, onClick, onAssign }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 shadow-sm p-4 hover:shadow-md transition cursor-pointer relative" onClick={onClick}>
      <div className="flex justify-between items-start mb-2">
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
            task.priority === 'high'
              ? 'text-red-600 border-red-200 bg-red-50'
              : task.priority === 'medium'
                ? 'text-yellow-600 border-yellow-200 bg-yellow-50'
                : 'text-green-600 border-green-200 bg-green-50'
          }`}
        >
          {priorityLabels[task.priority]}
        </span>
        <button
          className="text-gray-400 hover:text-dorren-dark"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((p) => !p);
          }}
        >
          <MoreHorizontal size={16} />
        </button>
        {open && (
          <div className="absolute right-3 top-8 bg-white border border-gray-100 shadow-lg z-10 text-sm">
            <button
              className="block px-3 py-2 hover:bg-gray-50 w-full text-left"
              onClick={(e) => {
                e.stopPropagation();
                onAssign(undefined);
                setOpen(false);
              }}
            >
              Сбросить исполнителя
            </button>
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-dorren-black leading-snug mb-3">{task.title}</p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {task.assigneeAvatar ? (
          <img src={task.assigneeAvatar} alt={task.assigneeName ?? ''} className="w-6 h-6 rounded-full object-cover" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <UserPlus size={14} />
          </div>
        )}
        <span className="truncate">{task.assigneeName || 'Не назначен'}</span>
      </div>
    </div>
  );
};

export default TaskCard;
