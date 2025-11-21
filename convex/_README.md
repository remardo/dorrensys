Этот каталог содержит заготовки для Convex backend.

- `convex.config.ts` — конфигурация приложения.
- `schema.ts` — схема таблицы `news`.
- `news.ts` — запрос `list` и мутация `upsertBulk`.

Что сделать, чтобы запустить Convex:
1) Установить CLI: `npm install convex`.
2) Залогиниться: `npx convex login`.
3) Инициализировать/деплоить: `npx convex dev` (локально) или `npx convex deploy` (в облако). После деплоя сгенерируется URL.
4) Записать URL в `.env.local` как `VITE_CONVEX_URL="https://<your>.convex.cloud"` и перезапустить dev-сервер.

Фронтенд будет использовать этот URL через `ConvexHttpClient` и сохранять новости через мутацию `news:upsertBulk`.
