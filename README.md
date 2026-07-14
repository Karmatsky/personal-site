# Personal Site

## English

### Overview

I've built a modern, responsive personal portfolio website using React and TypeScript. This project showcases my professional online presence with sections about me, my projects, and contact information. The site features a clean design with smooth animations and full internationalization support.

### Features

My site includes:

- **Responsive Design**: Mobile-first approach with Tailwind CSS for beautiful, adaptive layouts
- **Dark Mode Support**: Built-in theme switching with next-themes for comfortable viewing
- **Internationalization**: Full i18n support with English and Russian translations
- **Smooth Animations**: Framer Motion integration for polished transitions and interactions
- **Contact Form**: React Hook Form with validation for reliable communication with visitors
- **UI Components**: Pre-built accessible components with Lucide React icons
- **Notifications**: Toast notifications powered by Sonner
- **Type-Safe**: Full TypeScript support for robust development

### Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Build Tool**: Vite (fast development and production builds)
- **Internationalization**: i18next with automatic browser language detection
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form
- **Theme Management**: next-themes
- **Icons**: Lucide React

### Project Structure

```
src/
├── components/          # React components
│   ├── About.tsx       # About section
│   ├── Contact.tsx     # Contact form section
│   ├── Header.tsx      # Navigation header
│   ├── Projects.tsx    # Portfolio projects section
│   └── ui/             # Reusable UI components
│       ├── alert.tsx
│       └── sonner.tsx  # Toast notifications
├── i18n/               # Internationalization
│   ├── en.json        # English translations
│   ├── ru.json        # Russian translations
│   └── index.js       # i18n configuration
├── lib/
│   └── utils.ts       # Utility functions
├── App.tsx            # Main app component
├── main.tsx           # React entry point
└── index.css          # Global styles
```

### Getting Started

#### Prerequisites

- Node.js 16+ and npm/pnpm/yarn installed

#### Installation

```bash
git clone <repository-url>
npm install
npm run dev
```

Development server runs at `http://localhost:5173`

#### Build

```bash
npm run build
```

Production files go to `dist/` directory.

#### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Check code quality
- `npm run preview` - Preview production build

### Contact Form

The contact form sends through Formspree when a Formspree endpoint is configured.
Create a local `.env` file or set these variables in your hosting provider:

```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
```

Alternatively, set only the short id:

```bash
VITE_FORMSPREE_ID=your_form_id
```

If Formspree is not configured or is temporarily unavailable, the form opens a
prefilled email draft to `VITE_CONTACT_EMAIL`:

```bash
VITE_CONTACT_EMAIL=s.karmatsky@gmail.com
```

After changing Vite env variables, restart the dev server or redeploy the site.

### Language Support

The site automatically detects the user's browser language and displays content in English or Russian. Users can manually switch between languages using the language selector in the header.

### Customization

I can easily customize this site:

- **Edit Content**: Modify component files in `src/components/` for my content
- **Translations**: Update translation files in `src/i18n/` (en.json and ru.json)
- **Styling**: Customize Tailwind CSS configuration in `tailwind.config.js`
- **Theme**: Configure light/dark mode in the Header component

### Deployment

Live on [Vercel](http://karmatsky.vercel.app/).

Can be deployed to any static hosting:

- Vercel
- Netlify
- GitHub Pages
- AWS S3

Push `dist/` folder after building.

---

## Русский

### Описание

Я создал современное адаптивное личное портфолио, используя React и TypeScript. Проект демонстрирует моё профессиональное онлайн-присутствие с разделами обо мне, моих проектах и контактной информации. Сайт имеет чистый дизайн с плавными анимациями и полной поддержкой многоязычности.

### Возможности

Мой сайт включает:

- **Адаптивный дизайн**: Мобильный подход с Tailwind CSS для красивых и адаптивных макетов
- **Поддержка темного режима**: Встроенная смена темы с next-themes для комфортного просмотра
- **Интернационализация**: Полная поддержка i18n с переводами на английский и русский языки
- **Плавные анимации**: Интеграция Framer Motion для полированных переходов и взаимодействий
- **Контактная форма**: React Hook Form с валидацией для надежного взаимодействия посетителей
- **Компоненты пользовательского интерфейса**: Готовые доступные компоненты с иконками Lucide React
- **Уведомления**: Всплывающие уведомления от Sonner
- **Типобезопасность**: Полная поддержка TypeScript для надежной разработки

### Технологический стек

- **Фреймворк**: React 19
- **Язык**: TypeScript
- **Стилизация**: Tailwind CSS с пользовательскими анимациями
- **Инструмент сборки**: Vite (быстрая разработка и сборка для продакшена)
- **Интернационализация**: i18next с автоматическим определением языка браузера
- **Анимации**: Framer Motion
- **Обработка форм**: React Hook Form
- **Управление темой**: next-themes
- **Иконки**: Lucide React

### Структура проекта

```
src/
├── components/          # React компоненты
│   ├── About.tsx       # Раздел "О себе"
│   ├── Contact.tsx     # Раздел с контактной формой
│   ├── Header.tsx      # Навигационный заголовок
│   ├── Projects.tsx    # Раздел портфолио проектов
│   └── ui/             # Переиспользуемые компоненты интерфейса
│       ├── alert.tsx
│       └── sonner.tsx  # Всплывающие уведомления
├── i18n/               # Интернационализация
│   ├── en.json        # Переводы на английский
│   ├── ru.json        # Переводы на русский
│   └── index.js       # Конфигурация i18n
├── lib/
│   └── utils.ts       # Вспомогательные функции
├── App.tsx            # Главный компонент приложения
├── main.tsx           # Точка входа React
└── index.css          # Глобальные стили
```

### Начало работы

#### Требования

- Node.js версии 16+ и npm/pnpm/yarn

#### Установка

```bash
git clone <url-репозитория>
npm install
npm run dev
```

Сервер разработки на `http://localhost:5173`

#### Сборка

```bash
npm run build
```

Продакшен файлы в папке `dist/`.

#### Команды

- `npm run dev` - Запустить сервер разработки
- `npm run build` - Собрать для продакшена
- `npm run lint` - Проверить код
- `npm run preview` - Просмотреть продакшен

### Поддержка языков

Сайт автоматически определяет язык браузера пользователя и отображает контент на английском или русском языке. Пользователи могут вручную переключаться между языками, используя переключатель языков в заголовке.

### Кастомизация

Я могу легко кастомизировать этот сайт:

- **Редактирование контента**: Изменяю файлы компонентов в `src/components/` для своего контента
- **Переводы**: Обновляю файлы переводов в `src/i18n/` (en.json и ru.json)
- **Стилизация**: Настраиваю конфигурацию Tailwind CSS в `tailwind.config.js`
- **Тема**: Настраиваю светлый/темный режим в компоненте Header

### Развертывание

Живет на [Vercel](http://karmatsky.vercel.app/).

Можно развернуть на:

- Vercel
- Netlify
- GitHub Pages
- AWS S3

После сборки выложить папку `dist/`.
