import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { initialHome } from './data';

vi.mock('./convexClient', () => ({
  convexClient: null,
  fetchNewsFromConvex: vi.fn().mockResolvedValue([]),
  pushNewsToConvex: vi.fn(),
  fetchDocsFromConvex: vi.fn().mockResolvedValue([]),
  pushDocsToConvex: vi.fn(),
  fetchCoursesFromConvex: vi.fn().mockResolvedValue([]),
  pushCoursesToConvex: vi.fn(),
  fetchTasksFromConvex: vi.fn().mockResolvedValue([]),
  pushTasksToConvex: vi.fn(),
  fetchHomeFromConvex: vi.fn().mockResolvedValue(initialHome),
  pushHomeToConvex: vi.fn(),
  fetchUsersFromConvex: vi.fn().mockResolvedValue([]),
  updateUserRole: vi.fn(),
  requestAuthCode: vi.fn().mockResolvedValue('123456'),
  verifyAuthCode: vi.fn().mockResolvedValue({ token: 'devtoken', email: 'user@test.com' }),
}));

import App from './App';

describe('App', () => {
  it('рендерит главную страницу без ошибок', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Админ OFF/i)).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText(/Поиск документов/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Главная страница/i).length).toBeGreaterThan(0);
  });
});
