# Интернет магазин цифровых товаров

Курсовой проект по дисциплине «Технология разработки программного обеспечения».

Приложение представляет собой интернет-магазин цифровых товаров с каталогом,
корзиной, покупками, защищённым скачиванием, избранным и комментариями в
реальном времени.

## Технологии

- Django и Django REST Framework;
- JWT-аутентификация;
- Django Channels и WebSocket;
- React, React Router и TanStack Query;
- SQLite для локальной разработки;
- Redis и PostgreSQL могут использоваться в production.

## Возможности

- регистрация, вход и редактирование профиля;
- поиск, фильтрация и пагинация каталога;
- управление корзиной;
- покупка и скачивание цифровых товаров;
- персональный список избранного;
- комментарии с мгновенным отображением;
- административное управление товарами;
- PlantUML-диаграммы архитектуры и пользовательских сценариев.

## Запуск backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python manage.py migrate
python manage.py runserver
```

## Запуск frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm start
```

Backend доступен по адресу `http://localhost:8000`, frontend —
`http://localhost:3000`.

## Диаграммы

Исходники PlantUML находятся в каталоге `diagrams`, готовые изображения — в
`diagrams/png`.
