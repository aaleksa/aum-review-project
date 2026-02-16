# Vercel + Supabase Setup Guide

## 1️⃣ Supabase Database

1. Створіть проект на [supabase.com](https://supabase.com)
2. Знайдіть project_ref та пароль до бази:
   - Project Settings → Project Reference (наприклад, ipkvwfnzlvnytxpiiqaf)
   - Database → Connection string (пароль після postgres:)
3. Створіть таблиці через SQL Editor:
   - Вставте SQL з db/users.sql або supabase/migrations/20260216_create_users_table.sql
   - Натисніть Run
4. Або через Supabase CLI:
   - Встановіть CLI:
     ```bash
     brew install supabase/tap/supabase
     ```
   - Ініціалізуйте проект:
     ```bash
     supabase init
     ```
   - Додайте міграцію у supabase/migrations/
   - Виконайте міграцію:
     ```bash
     supabase db push --db-url "postgresql://postgres:<password>@db.<project_ref>.supabase.co:5432/postgres"
     ```

---

## 2️⃣ Vercel

1. Встановіть Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Залогіньтесь:
   ```bash
   vercel login
   ```
3. Створіть проект на [vercel.com](https://vercel.com) або через CLI:
   ```bash
   vercel
   ```
4. Додайте .env.local у корінь проекту:
   ```env
   DATABASE_URL=postgresql://postgres:<password>@db.<project_ref>.supabase.co:5432/postgres
   ```
5. Додайте .vercelignore для виключення lambda/:
   ```
   lambda/
tests/
scripts/
   ```
6. Переконайтесь, що serverless функції у api/, а не lambda/

---

## 3️⃣ Деплой та тестування

1. Запустіть локально:
   ```bash
   vercel dev
   ```
2. Деплой на Vercel:
   ```bash
   vercel --prod
   ```
3. Перевірте, що функції працюють, а база підключена (через API або frontend)

---

## 4️⃣ Додатково

- Для міграцій локальної бази:
  ```bash
  supabase db reset
  ```
- Для production/preview:
  ```bash
  supabase db push --db-url "postgresql://postgres:<password>@db.<project_ref>.supabase.co:5432/postgres"
  ```

---

**Порада:**
- Не публікуйте пароль до бази у відкритому репозиторії.
- Структура таблиць має бути однакова для локальної та production бази.
