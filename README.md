# Internet Publisher Starter

Стартовий проєкт для дипломної роботи **"Розроблення Web-сайту для інтернет-видавництва"**.

## Стек
- Nuxt 3
- Vue 3
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore
- Firebase Storage

## Як запустити локально
1. Розпакуй архів.
2. Відкрий папку у VS Code.
3. Скопіюй `.env.example` у `.env`.
4. Заповни Firebase-змінні.
5. Встанови залежності:
   `yarn install`
6. Запусти проєкт:
   `yarn dev`

## Структура даних
### users
- name
- email
- role
- createdAt

### categories
- name
- description
- createdAt

### publications
- title
- author
- description
- content
- categoryId
- coverImage
- createdAt

## Логіка ролей
- guest: перегляд каталогу та сторінки публікації
- user: усе як guest + профіль
- admin: CRUD публікацій, CRUD категорій, перегляд користувачів

## GitHub Actions
Ми будемо вносити зміни через workflow-файли з нумерацією:
- TASK001_...
- TASK002_...
- TASK003_...

У стартовому пакеті вже є перший workflow для перевірки збірки.
