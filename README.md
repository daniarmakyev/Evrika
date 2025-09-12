Содержание

- Ключевые технологии
- Быстрый старт
- Структура проекта
- State (store) — RTK Query vs Redux Toolkit slices
- SCSS и адаптивность (mixins, media multipliers)
- Работа с API
- Кодстайл и соглашения
- Ссылки видео-инструкции
---

Ключевые технологии

- Next.js (app router)
- React 18+, TypeScript
- SCSS (sass) + модульные стили
- Redux Toolkit (RTK) + RTK Query (частично)
- axios, react-hook-form, lucide-react
- dev: @svgr/webpack, json-server (локальный мок)

---

Быстрый старт (локально)
Требования: Node.js LTS (рекомендуется >=18), npm или yarn.

1. Установить зависимости

```bash
npm ci
# или
yarn install
```

2. Запуск разработки

```bash
npm run dev
# http://localhost:3000
```

3. Опционально — локальный мок API

```bash
npm run server
# json-server --watch db.json --port 3001
```

4. Сборка / запуск продакшн

```bash
npm run build
npm run start
```

---

Структура проекта

- src/app — страницы и маршруты
- src/components — UI и модули
- src/consts — api.ts, types.ts, utilits.ts
- src/context — ModalContext и пр.
- src/store — глобальное состояние (см. подробнее ниже)
- src/styles — \_varibles.scss, mixins, global.scss
- public — статические ресурсы

---

State (store) — RTK Query , Redux Toolkit slices
В проекте используются оба подхода: RTK Query для ситуаций с активным взаимодействием с REST API и кешированием, и классические Redux Toolkit slices / async thunks для локальной или более сложной бизнес-логики.

Как понять, где что используется

- Файлы с суффиксом `.slice.ts` и/или `.action.ts` — стандартные Redux Toolkit slices и асинхронные thunk-экшены. Пример: `src/store/lesson/lesson.slice.ts`, `src/store/courseGroup/courseGroup.action.ts`.
- Модули, где присутствует сервис/endpoint файл (часто называемый `api.ts`, `service.ts` или `export.ts` в папке) — вероятно реализованы через RTK Query. Пример: `src/store/admin/export/export.ts` (содержит endpoints для запросов).

Рекомендации по использованию

- Используйте RTK Query когда:
  - Вы делаете CRUD запросы и хотите автоматическое кеширование / повторные запросы / invalidation.
  - API ресурсы легко описать как endpoints.
- Используйте slices + thunks когда:
  - Нужна сложная синхронизация локального состояния, составные транзакции, optimistic updates с ручным контролем, или вам нужно делить логику вне RTK Query.

Примеры (упрощённо)

RTK Query service (пример добавления endpoint):

```ts
// filepath: src/store/api/service.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  tagTypes: ["Teachers", "Students"],
  endpoints: (build) => ({
    getTeachers: build.query<Teacher[], void>({
      query: () => "/teachers",
      providesTags: ["Teachers"],
    }),
    createTeacher: build.mutation<Teacher, Partial<Teacher>>({
      query: (body) => ({ url: "/teachers", method: "POST", body }),
      invalidatesTags: ["Teachers"],
    }),
  }),
});

export const { useGetTeachersQuery, useCreateTeacherMutation } = api;
```

Redux slice + thunk (пример):

```ts
// filepath: src/store/user/user.slice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../consts/api";

export const fetchUser = createAsyncThunk("user/fetch", async (id: string) => {
  const res = await apiClient.get(`/users/${id}`);
  return res.data;
});

const userSlice = createSlice({
  name: "user",
  initialState: { data: null, status: "idle", error: null },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
    });
  },
});

export default userSlice.reducer;
```

Интеграция в store:

- RTK Query api.reducerPath подключается в root reducer и middleware api.middleware добавляется в store configuration вместе с defaultMiddleware.

---

SCSS, миксины и media multipliers (как мы пишем адаптивность)
В проекте применяются глобальные SCSS-переменные и миксины:

- `src/styles/_varibles.scss` — цвета, размеры, типографика, множители.
- `src/styles/mixins/` — набор миксинов, в том числе `respond-above()` (в `_media-queries.scss`) и утилиты (`flex.scss`).

Подход к медиа-запросам

- Основной миксин: `respond-above(breakpoint)` — инкапсулирует media query для заданного брейкпоинта.
- Брекпоинты используемые в проекте: xs, sm, lg, mac, xlg, fhd, fhd-plus, qhd, uhd.
- В переменных хранятся базовые размеры и множители, которые используются для масштабирования paddings/font-size/height и т.д.

Пример использования миксина:

```scss
// filepath: any component styles.module.scss
.button {
  height: 36px;
  font-size: 14px;

  @include respond-above(lg) {
    height: 40px;
    font-size: 15px;
  }

  @include respond-above(mac) {
    height: 44px;
  }
}
```

О множителях (scaling multipliers)

- В `_media-queries.scss` объявлены множители (
  //md: 0.68
  //lg: 0.84
  //mac: 1
  //xlg: 1.11
  //fhd: 1.3
  //fhd-plus: 1.625
  //qhd: 1.77
  ) - используются для пропорционального масштабирования элементов.

---

SCSS-модули и BEM-подход

- Компоненты используют локальные scss-модули: `styles.module.scss`.
- Классы внутри файлов оформлены по BEM-подобному стилю: `.homework__content`, `.table__button`.
- Избегайте глобального стиля, используйте переменные/mixins для консистентности.

---

Работа с API и best practices

- Централизованный клиент в `src/consts/api.ts` (axios wrapper) — использовать для нестандартных запросов и в thunk'ах.
- Для CRUD и кешируемых ресурсов — предпочтительно RTK Query.
- Для сложных транзакций/локального state orchestration — slices + thunks.
- Всегда обрабатывать ошибки и показывать loading / error UI (skeletons, error components).

---

Кодстайл и соглашения

- Компоненты: PascalCase именование; файл `index.tsx` + `styles.module.scss`.
- Типы: хранить в `src/consts/types.ts` и локально по необходимости.

---
Ссылки видео-инструкции:
- [Учитель](https://youtu.be/tT0Sj3Qh2oI)
- [Ученик](https://youtu.be/tT0Sj3Qh2oI)
- [Админ](https://youtu.be/MMAAJ7fR1-c)
