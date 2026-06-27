# Интернет-магазин цифровых товаров

Курсовой проект по дисциплине «Технология разработки программного обеспечения».

Траектория В: Django REST Framework + React SPA + JWT + AJAX + WebSocket.

## [Пояснительная записка](https://disk.yandex.ru/i/fDctOhaKfPgXtQ)

### Содержание

1. [О проекте](#1-о-проекте)
2. [Технологический стек](#2-технологический-стек)
3. [Структура репозитория](#3-структура-репозитория)
4. [Требования к окружению](#4-требования-к-окружению)
5. [Установка и настройка Backend](#5-установка-и-настройка-backend)
6. [Установка и настройка Frontend](#6-установка-и-настройка-frontend)
7. [Запуск приложения](#7-запуск-приложения)
8. [Переменные окружения](#8-переменные-окружения)
9. [API: основные эндпоинты](#9-api-основные-эндпоинты)
10. [Функциональность](#10-функциональность)
11. [Роли пользователей](#11-роли-пользователей)
12. [Диаграммы](#12-диаграммы)
13. [Тестирование](#13-тестирование)

## 1. О проекте

Интернет-магазин цифровых товаров — это клиент-серверное веб-приложение для просмотра, покупки и скачивания цифровых продуктов.

Пользователь может зарегистрироваться, войти в личный кабинет, просматривать каталог, добавлять товары в корзину и избранное, оформлять покупки, скачивать приобретенные товары и оставлять комментарии. Администратор управляет товарами, категориями и пользовательскими данными через Django Admin и защищенные API-сценарии.

Проект построен как SPA-приложение: frontend на React взаимодействует с backend через REST API, хранит пользовательское состояние на клиенте и обновляет данные без перезагрузки страниц. Для авторизации используется JWT, а для комментариев к товарам добавлен WebSocket-канал.

## 2. Технологический стек

### Backend

| Компонент | Технология |
| --- | --- |
| Язык | Python |
| Фреймворк | Django 6, Django REST Framework |
| Аутентификация | JWT, djangorestframework-simplejwt |
| Real-time | Django Channels, Daphne |
| База данных | SQLite для локальной разработки |
| Медиафайлы | Django FileField / MEDIA_ROOT |
| CORS | django-cors-headers |

### Frontend

| Компонент | Технология |
| --- | --- |
| Язык | JavaScript, JSX |
| Библиотека интерфейса | React 18 |
| Маршрутизация | React Router 6 |
| HTTP-клиент | Axios |
| Кеширование запросов | TanStack React Query |
| Сборка | Create React App |

## 3. Структура репозитория

```text
digital_shop/
├── backend/                                  # серверная часть Django
│   ├── cart/                                 # корзина пользователя
│   │   ├── migrations/                       # миграции приложения cart
│   │   ├── admin.py                          # регистрация моделей корзины в админке
│   │   ├── apps.py                           # конфигурация Django-приложения
│   │   ├── models.py                         # модели Cart и CartItem
│   │   ├── serializers.py                    # сериализаторы корзины
│   │   ├── urls.py                           # маршруты cart API
│   │   └── views.py                          # ViewSet корзины
│   │
│   ├── config/                               # настройки проекта
│   │   ├── __init__.py
│   │   ├── asgi.py                           # ASGI-конфигурация и подключение WebSocket
│   │   ├── settings.py                       # основные настройки Django
│   │   ├── urls.py                           # корневые URL проекта
│   │   └── wsgi.py                           # WSGI-конфигурация
│   │
│   ├── orders/                               # покупки и скачивание товаров
│   │   ├── migrations/                       # миграции приложения orders
│   │   ├── __init__.py
│   │   ├── admin.py                          # заказы в Django Admin
│   │   ├── apps.py
│   │   ├── models.py                         # модель Order
│   │   ├── serializers.py                    # сериализатор заказа
│   │   ├── tests.py                          # тесты покупки и скачивания
│   │   ├── urls.py                           # маршруты orders API
│   │   └── views.py                          # оформление заказа и download endpoint
│   │
│   ├── products/                             # каталог цифровых товаров
│   │   ├── migrations/                       # миграции товаров, комментариев и избранного
│   │   ├── __init__.py
│   │   ├── admin.py                          # управление товарами и категориями
│   │   ├── apps.py
│   │   ├── consumers.py                      # WebSocket consumer комментариев
│   │   ├── middleware.py                     # JWT-аутентификация для WebSocket
│   │   ├── models.py                         # Category, Product, Comment, Favorite
│   │   ├── pagination.py                     # пагинация каталога
│   │   ├── permissions.py                    # права доступа
│   │   ├── routing.py                        # WebSocket-маршруты
│   │   ├── serializers.py                    # сериализаторы каталога
│   │   ├── tests.py                          # тесты избранного и комментариев
│   │   ├── urls.py                           # маршруты products API
│   │   └── views.py                          # ViewSet товаров, категорий и комментариев
│   │
│   ├── users/                                # пользователи и профиль
│   │   ├── migrations/                       # миграции приложения users
│   │   ├── __init__.py
│   │   ├── admin.py                          # пользователи в админке
│   │   ├── apps.py
│   │   ├── models.py                         # пользовательская модель/профиль
│   │   ├── serializers.py                    # регистрация и профиль
│   │   ├── tests.py                          # тесты пользователей
│   │   ├── urls.py                           # маршруты auth API
│   │   └── views.py                          # регистрация и профиль
│   │
│   ├── .env.example                          # пример переменных окружения backend
│   ├── manage.py                             # CLI Django
│   └── requirements.txt                      # Python-зависимости
│
├── frontend/                                 # клиентская часть React SPA
│   ├── public/                               # статический HTML-шаблон
│   │   └── index.html
│   │
│   ├── src/                                  # исходный код frontend
│   │   ├── components/                       # переиспользуемые компоненты
│   │   │   ├── FavoriteButton.js             # кнопка добавления в избранное
│   │   │   ├── Footer.js                     # нижняя часть сайта
│   │   │   ├── Navbar.js                     # навигация
│   │   │   ├── PrivateRoute.js               # защита маршрутов
│   │   │   ├── ProductCard.js                # карточка товара
│   │   │   └── ProductComments.js            # комментарии с WebSocket
│   │   │
│   │   ├── contexts/                         # глобальные состояния
│   │   │   ├── AuthContext.js                # авторизация пользователя
│   │   │   └── CartContext.js                # состояние корзины
│   │   │
│   │   ├── pages/                            # страницы приложения
│   │   │   ├── CartPage.js                   # корзина
│   │   │   ├── CreateProduct.js              # создание товара
│   │   │   ├── EditProduct.js                # редактирование товара
│   │   │   ├── HomePage.js                   # каталог и главная страница
│   │   │   ├── Login.js                      # вход
│   │   │   ├── MyFavorites.js                # избранные товары
│   │   │   ├── MyOrders.js                   # заказы пользователя
│   │   │   ├── MyProducts.js                 # товары пользователя/администратора
│   │   │   ├── ProductDetail.js              # карточка товара
│   │   │   ├── ProfilePage.js                # профиль
│   │   │   └── Register.js                   # регистрация
│   │   │
│   │   ├── services/                         # работа с API
│   │   │   ├── api.js                        # Axios-клиент
│   │   │   └── auth.js                       # функции авторизации
│   │   │
│   │   ├── App.js                            # маршрутизация React-приложения
│   │   ├── index.css                         # глобальные стили
│   │   └── index.js                          # точка входа React
│   │
│   ├── .env.example                          # пример переменных окружения frontend
│   ├── package-lock.json                     # lock-файл npm
│   └── package.json                          # зависимости и scripts
│
├── .gitignore                                # исключения Git
└── README.md                                 # описание проекта
```

## 4. Требования к окружению

| Инструмент | Версия |
| --- | --- |
| Python | 3.11 или новее |
| Node.js | 18 или новее |
| npm | 9 или новее |
| Git | 2.40 или новее |

Для WebSocket-запуска рекомендуется использовать Daphne. Redis можно подключить через `REDIS_URL`, но для локального просмотра проекта допустим стандартный режим разработки.

## 5. Установка и настройка Backend

### 5.1. Клонирование репозитория

```powershell
git clone https://github.com/kolodin777/internet-magazin-cifrovykh-tovarov.git
cd internet-magazin-cifrovykh-tovarov/backend
```

### 5.2. Виртуальное окружение

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Для Linux / macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 5.3. Установка зависимостей

```powershell
pip install -r requirements.txt
```

Основные backend-зависимости:

```text
Django
djangorestframework
djangorestframework-simplejwt
channels
channels-redis
daphne
django-cors-headers
python-dotenv
Pillow
```

### 5.4. Переменные окружения

```powershell
Copy-Item .env.example .env
```

После копирования можно изменить `SECRET_KEY`, `DEBUG` и `REDIS_URL`.

### 5.5. Миграции и администратор

```powershell
python manage.py migrate
python manage.py createsuperuser
```

### 5.6. Проверка backend

```powershell
python manage.py check
python manage.py test
```

## 6. Установка и настройка Frontend

### 6.1. Переход в каталог

```powershell
cd ../frontend
```

### 6.2. Установка зависимостей

```powershell
npm install
```

### 6.3. Переменные окружения

```powershell
Copy-Item .env.example .env
```

По умолчанию frontend обращается к API по адресу:

```text
REACT_APP_API_URL=http://localhost:8000/api
```

## 7. Запуск приложения

### Backend

Обычный HTTP-запуск:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

Запуск через ASGI-сервер для полноценной работы WebSocket:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
daphne -p 8000 config.asgi:application
```

### Frontend

```powershell
cd frontend
npm start
```

После запуска:

| Сервис | Адрес |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:8000/api/` |
| Django Admin | `http://localhost:8000/admin/` |

## 8. Переменные окружения

### backend/.env

```env
SECRET_KEY=replace-me
DEBUG=True
REDIS_URL=
```

### frontend/.env

```env
REACT_APP_API_URL=http://localhost:8000/api
```

Файлы `.env` не публикуются в репозитории. Для примера используются `.env.example`.

## 9. API: основные эндпоинты

### Аутентификация `/api/auth/`

| Метод | Эндпоинт | Доступ | Назначение |
| --- | --- | --- | --- |
| POST | `/api/auth/register/` | Все | Регистрация пользователя |
| POST | `/api/auth/login/` | Все | Получение JWT access/refresh |
| POST | `/api/auth/token/refresh/` | Все | Обновление access-токена |
| GET | `/api/auth/profile/` | Авторизован | Просмотр профиля |
| PUT/PATCH | `/api/auth/profile/` | Авторизован | Изменение профиля |

### Каталог `/api/`

| Метод | Эндпоинт | Доступ | Назначение |
| --- | --- | --- | --- |
| GET | `/api/categories/` | Все | Список категорий |
| GET | `/api/products/` | Все | Список товаров |
| GET | `/api/products/{id}/` | Все | Карточка товара |
| POST | `/api/products/` | Администратор | Создание товара |
| PUT/PATCH | `/api/products/{id}/` | Администратор | Изменение товара |
| DELETE | `/api/products/{id}/` | Администратор | Удаление товара |
| GET | `/api/products/?search=text` | Все | Поиск по названию и описанию |
| GET | `/api/products/?category=1` | Все | Фильтр по категории |
| GET | `/api/products/?price_min=100&price_max=500` | Все | Фильтр по цене |

### Избранное и комментарии

| Метод | Эндпоинт | Доступ | Назначение |
| --- | --- | --- | --- |
| POST | `/api/products/{id}/favorite/` | Авторизован | Добавить или убрать товар из избранного |
| GET | `/api/products/favorites/` | Авторизован | Получить список избранных товаров |
| GET | `/api/comments/?product={id}` | Все | Получить комментарии товара |
| POST | `/api/comments/` | Авторизован | Добавить комментарий |
| DELETE | `/api/comments/{id}/` | Автор или администратор | Удалить комментарий |

### Корзина `/api/cart/`

| Метод | Эндпоинт | Доступ | Назначение |
| --- | --- | --- | --- |
| GET | `/api/cart/my_cart/` | Авторизован | Получить корзину |
| POST | `/api/cart/add_item/` | Авторизован | Добавить товар |
| POST | `/api/cart/update_item/` | Авторизован | Изменить количество |
| POST | `/api/cart/remove_item/` | Авторизован | Удалить позицию |
| POST | `/api/cart/clear_cart/` | Авторизован | Очистить корзину |

### Заказы `/api/orders/`

| Метод | Эндпоинт | Доступ | Назначение |
| --- | --- | --- | --- |
| POST | `/api/orders/` | Авторизован | Купить товар |
| GET | `/api/orders/my_orders/` | Авторизован | Получить свои покупки |
| GET | `/api/orders/{id}/download/` | Авторизован | Скачать приобретенный товар в `.txt` |

### WebSocket

| URL | Назначение |
| --- | --- |
| `ws://localhost:8000/ws/products/{product_id}/comments/?token=<access_token>` | Обмен комментариями к товару в реальном времени |

## 10. Функциональность

### Неавторизованный пользователь

- просматривает главную страницу и каталог товаров;
- использует поиск, фильтрацию по категории и диапазону цены;
- открывает карточку товара;
- просматривает комментарии;
- переходит к регистрации или входу.

### Авторизованный пользователь

- выполняет все действия неавторизованного пользователя;
- редактирует профиль;
- добавляет товары в корзину;
- оформляет покупку цифрового товара;
- видит список своих покупок;
- скачивает купленный товар в виде `.txt`-файла с названием товара;
- добавляет и удаляет товары из избранного;
- оставляет комментарии к товарам с обновлением через WebSocket.

### Администратор

- управляет товарами и категориями;
- добавляет описание, цену, файл и активность товара;
- просматривает пользователей, заказы, корзины и комментарии;
- удаляет некорректные комментарии;
- использует стандартную панель Django Admin.

## 11. Роли пользователей

| Роль | Описание |
| --- | --- |
| Гость | Может просматривать каталог, карточки товаров и комментарии |
| Пользователь | Может покупать товары, работать с корзиной, избранным и комментариями |
| Администратор | Управляет данными магазина и имеет расширенные права |

## 12. Диаграммы

В каталоге `diagrams` находятся PlantUML-исходники и готовые PNG-изображения:

- `use-case-diagram.puml` — диаграмма вариантов использования;
- `ER-diagram-database.puml` — ER-диаграмма базы данных;
- `component-diagram.puml` — компонентная диаграмма;
- `domain-model.puml` — модель предметной области;
- `JWT-authentication-sequence.puml` — последовательность JWT-аутентификации;
- `purchase-activity-diagram.puml` — процесс покупки;
- `download-access-state-diagram.puml` — состояния доступа к скачиванию;
- `deployment-diagram.puml` — диаграмма развертывания.

Готовые изображения находятся в каталоге `diagrams/png`.

## 13. Тестирование

### Backend

```powershell
cd backend
python manage.py test
```

Тесты покрывают:

- добавление и удаление товаров из избранного;
- создание и получение комментариев;
- оформление покупки;
- защиту скачивания товара для владельца заказа.

### Frontend

```powershell
cd frontend
npm run build
```

Команда проверяет корректность сборки React-приложения.

## 📊 Статистика разработки

**Всего коммитов:** 28  
**Период:** 26 мая – 27 июня 2026 г.

| Показатель | Значение |
|------------|----------|
| Средняя частота | ~1 коммит/день |
| Самый активный день | 27 июня (3 коммита) |
| Пик активности | Финальная неделя |

### Основные этапы

| Дата | Этап |
|------|------|
| 26 мая | Инициализация проекта |
| 28 мая | JWT-аутентификация |
| 30 мая | Каталог товаров |
| 1 июня | Корзина |
| 3 июня | Заказы и скачивание |
| 5 июня | React SPA |
| 7 июня | WebSocket |
| 8 июня | Тесты |
| 9 июня | Документация |
| 27 июня | Итоговая структура docs |

Проект выполнен в рамках дисциплины «Технология разработки программного обеспечения» и демонстрирует разработку SPA-приложения с REST API, JWT-аутентификацией и real-time взаимодействием.
