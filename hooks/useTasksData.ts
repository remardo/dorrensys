import { useCallback, useEffect, useMemo, useState } from 'react';
import { DocumentItem, Task, User } from '../types';
import { fetchDocsFromConvex, fetchTasksFromConvex, fetchUsersFromConvex, pushTasksToConvex } from '../convexClient';

interface UseTasksDataResult {
  tasks: Task[];
  users: User[];
  docs: DocumentItem[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  saveTasks: (next: Task[]) => Promise<void>;
  assignTask: (taskId: string, user?: User) => Promise<void>;
  moveTask: (taskId: string, status: Task['status']) => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTasksData = (): UseTasksDataResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [taskList, userList, docList] = await Promise.all([
        fetchTasksFromConvex(),
        fetchUsersFromConvex(),
        fetchDocsFromConvex(),
      ]);
      setTasks(taskList ?? []);
      setUsers(userList ?? []);
      setDocs(docList ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const saveTasks = useCallback(
    async (next: Task[]) => {
      setTasks(next);
      await pushTasksToConvex(next, localStorage.getItem('convex_token'));
    },
    [],
  );

  const assignTask = useCallback(
    async (taskId: string, user?: User) => {
      const updated = tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              assigneeEmail: user?.email,
              assigneeName: user?.name,
              assigneeAvatar: user?.avatar,
              assignee: user,
            }
          : t,
      );
      await saveTasks(updated);
    },
    [tasks, saveTasks],
  );

  const moveTask = useCallback(
    async (taskId: string, status: Task['status']) => {
      const updated = tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
      await saveTasks(updated);
    },
    [tasks, saveTasks],
  );

  const addTask = useCallback(
    async (task: Task) => {
      await saveTasks([task, ...tasks]);
      const freshUsers = await fetchUsersFromConvex();
      if (freshUsers) setUsers(freshUsers);
    },
    [tasks, saveTasks],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      const updated = tasks.filter((t) => t.id !== taskId);
      await saveTasks(updated);
    },
    [tasks, saveTasks],
  );

  return useMemo(
    () => ({
      tasks,
      users,
      docs,
      loading,
      error,
      refresh: fetchAll,
      saveTasks,
      assignTask,
      moveTask,
      addTask,
      deleteTask,
    }),
    [tasks, users, docs, loading, error, fetchAll, saveTasks, assignTask, moveTask, addTask, deleteTask],
  );
};
