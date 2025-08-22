# Smart Task Manager (Frontend)

A modern task management application with AI-powered task suggestions and smart reminders, built with Angular 19 and Node.js. This frontend application provides an intuitive interface for managing tasks, integrating with Google Calendar, and leveraging AI for smart task management.

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── task-list/     # Task list component
│   │   │   ├── task-form/     # Task creation/editing form
│   │   │   └── ...
│   │   ├── services/          # Data services
│   │   │   ├── task.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── ...
│   │   ├── models/            # Data models
│   │   │   └── task.model.ts
│   │   ├── guards/            # Route guards
│   │   ├── interceptors/      # HTTP interceptors
│   │   └── app.module.ts      # Root module
│   ├── assets/                # Static assets
│   ├── environments/          # Environment configurations
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── styles/                # Global styles
└── angular.json               # Angular CLI configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+ or Yarn
- Angular CLI (install with `npm install -g @angular/cli`)
- Backend server (see [Backend README](../backend/README.md))

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   ```

### Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

2. Start the development server:
   ```bash
   ng serve
   ```

3. Open your browser and navigate to `http://localhost:4200`

## 🔧 Development

### Build

```bash
# Development build
ng build

# Production build
ng build --configuration=production
```

### Running Tests

```bash
# Unit tests
ng test

# End-to-end tests
ng e2e

# Code coverage
ng test --no-watch --code-coverage
```

### Linting

```bash
# Run linter
ng lint

# Fix linting issues
ng lint --fix
```

## 📱 Responsive Design

The application is built with a mobile-first approach and includes responsive breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Features

- **Task Management**: Create, read, update, and delete tasks with ease
- **AI-Powered Suggestions**: Get smart task recommendations based on priority and due dates
- **Smart Reminders**: AI-generated reminders that adapt to task priority and deadlines
- **Priority-Based Organization**: Tasks are categorized by priority (High, Medium, Low)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant feedback when tasks are modified

## Tech Stack

### Frontend
- **Framework**: Angular 19
- **UI Components**: Angular Material
- **State Management**: RxJS
- **Styling**: CSS3 with Flexbox/Grid

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: 
  - LangChain
  - Hugging Face Inference API
  - Mistral 7B model
- **Database**: Notion API (for data persistence)
- **API**: RESTful endpoints

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- Notion API key
- Hugging Face API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smart-task-manager.git
   cd smart-task-manager
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the `backend` directory with:
   ```env
   NOTION_API_KEY=your_notion_api_key
   NOTION_DATABASE_ID=your_notion_database_id
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   PORT=3003
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

2. **In a new terminal, start the frontend**
   ```bash
   cd frontend
   ng serve
   ```

3. **Open your browser** and navigate to `http://localhost:4200`

## AI Features

### Smart Task Suggestions
- Analyzes your task list and suggests the next best task to work on
- Considers task priority, due dates, and status
- Uses Mistral 7B model through Hugging Face Inference API

### Smart Reminders
- Automatically generates reminders based on task priority and due dates
- High priority tasks get reminders 3 days before due date
- Medium priority tasks get reminders 2 days before due date
- Low priority tasks get reminders 1 day before due date
- Includes fallback mechanism if AI service is unavailable

## Project Structure

```
smart-task-manager/
├── src/                    # Frontend source code
│   ├── app/
│   │   ├── components/     # Angular components
│   │   ├── models/         # TypeScript interfaces
│   │   ├── services/       # Angular services
│   │   └── app.component.* # Root component
│   └── ...
├── backend/                # Backend source code
│   ├── index.js            # Main server file
│   ├── notion.js           # Notion API integration
│   ├── langchain.js        # LangChain implementation
│   ├── hf.js              # Hugging Face integration
│   └── ai.js              # AI utilities
├── package.json           # Frontend dependencies
├── backend/package.json   # Backend dependencies
└── README.md             # This file
```

## API Endpoints

### Task Management
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### AI Features
- `POST /api/langchain/suggest-next` - Get AI-suggested next task
- `POST /api/langchain/generate-reminders` - Generate smart reminders

## Testing

Run unit tests:
```bash
ng test
```

Run end-to-end tests:
```bash
ng e2e
```

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Angular](https://angular.io/)
- [Node.js](https://nodejs.org/)
- [LangChain](https://www.langchain.com/)
- [Hugging Face](https://huggingface.co/)
- [Notion API](https://developers.notion.com/)

---

<div align="center">
  Made with ❤️ 
</div>

# Smart Task Manager Frontend

A modern, responsive task management application built with Angular 19, featuring AI-powered task suggestions and smart reminders.

![Smart Task Manager Preview](https://via.placeholder.com/1200x600/2c3e50/ffffff?text=Smart+Task+Manager+Dashboard)

## 🌟 Features

### 🎯 Task Management
- **Create, Read, Update, Delete** tasks with ease
- **Drag-and-Drop** task organization
- **Smart Filters** for quick task access
- **Due Date Management** with calendar integration

### 🤖 AI-Powered Assistance
- **Smart Task Suggestions** based on priority and deadlines
- **Auto-Categorization** of tasks
- **Context-Aware Reminders** that adapt to your schedule
- **Natural Language Processing** for task creation

### 🎨 Modern UI/UX
- **Responsive Design** works on all devices
- **Dark/Light Mode** theming
- **Keyboard Shortcuts** for power users
- **Real-time Updates** and notifications

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+ or Yarn
- Angular CLI 19+
- Backend API (see [backend README](../backend/README.md))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smart-task-manager.git
   cd smart-task-manager/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment**
   Create `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3003/api', // Your backend URL
     appName: 'Smart Task Manager',
     version: '1.0.0',
     enableAnalytics: false
   };
   ```

### Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

```bash
npm start
# or
ng serve
```

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

```bash
npm run build
# or
ng build
```

### Running Unit Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

```bash
npm test
# or
ng test
```

### Running End-to-End Tests

Run `ng e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io/).

```bash
npm run e2e
# or
ng e2e
```

## 🏗 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/               # Core module (singleton services, guards, interceptors)
│   │   ├── features/           # Feature modules
│   │   │   ├── tasks/          # Task management
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   └── settings/       # User settings
│   │   ├── shared/             # Shared components, directives, pipes
│   │   ├── app.component.*     # Root component
│   │   └── app.module.ts       # Root module
│   ├── assets/                 # Static assets
│   ├── environments/           # Environment configurations
│   └── styles/                 # Global styles
├── .browserslistrc             # Browser support configuration
├── angular.json                # Angular CLI configuration
└── package.json                # Project dependencies
```

## 🛠 Development Guidelines

### Code Style

This project follows:
- [Angular Style Guide](https://angular.io/guide/styleguide)
- TypeScript strict mode
- SCSS for styling
- [Angular ESLint](https://github.com/angular-eslint/angular-eslint) for linting

### Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Example commit message:

```
feat(tasks): add task completion animation

- Added smooth animation when marking tasks as complete
- Updated task service to handle completion state

Closes #123
```

### Pull Requests

When creating a pull request, please ensure:

1. All tests pass
2. Code is properly documented
3. New features include unit tests
4. UI changes include screenshots
5. Update relevant documentation

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 13+)
- Chrome for Android

## 📚 Learn More

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [RxJS Documentation](https://rxjs.dev/guide/overview)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guide](CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- [Angular Team](https://angular.io/)
- [Angular Material](https://material.angular.io/)
- [RxJS](https://rxjs.dev/)
- [NgRx](https://ngrx.io/) (if used)
- All our amazing contributors
