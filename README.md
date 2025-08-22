# Smart Task Manager with LangChain

An intelligent task management application that leverages LangChain and AI to help you manage your tasks more efficiently. The application provides smart task suggestions, prioritization, and integrates with popular productivity tools.

## Project Structure

```
SmartTaskManager-TS-LangChain_/
│
├── backend/                    # Backend server (Node.js/TypeScript)
│   ├── src/
│   │   ├── agents/            # AI agents for task management
│   │   │   └── ReminderAgent.ts
│   │   ├── chains/            # LangChain chains for task processing
│   │   │   ├── SummarizeTasksChain.ts
│   │   │   ├── SuggestTaskChain.ts
│   │   │   └── PrioritizeTasksChain.ts
│   │   ├── controllers/       # API controllers
│   │   │   ├── TaskController.ts
│   │   │   └── GoogleAuthController.ts
│   │   ├── services/          # Business logic services
│   │   │   ├── TaskService.ts
│   │   │   └── GoogleCalendarService.ts
│   │   ├── tools/             # External tool integrations
│   │   │   ├── NotionTool.ts
│   │   │   └── GoogleCalendarTool.ts
│   │   ├── types/             # TypeScript type definitions
│   │   │   ├── Task.ts
│   │   │   └── BaseTask.ts
│   │   ├── routes/            # API route definitions
│   │   │   └── taskRoutes.ts
│   │   ├── index.ts           # Application entry point
│   │   └── loadEnv.ts         # Environment configuration
│   ├── dist/                  # Compiled JavaScript output
│   ├── architecture.md        # Architecture documentation
│   └── package.json           # Backend dependencies
│
└── frontend/                  # Frontend application (Angular)
    ├── src/
    │   ├── app/
    │   │   ├── components/    # UI components
    │   │   │   ├── add-task/  # Add task component
    │   │   │   └── task-list/ # Task list component
    │   │   ├── models/        # Data models
    │   │   │   └── task.model.ts
    │   │   ├── services/      # API services
    │   │   │   └── task.service.ts
    │   │   └── *.component.*  # Core app components
    │   ├── assets/            # Static assets
    │   ├── index.html         # Main HTML file
    │   └── styles.css         # Global styles
    ├── public/                # Public assets
    │   └── favicon.ico
    ├── angular.json           # Angular configuration
    └── package.json           # Frontend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm (v8 or later) or yarn
- Angular CLI (for frontend development)
- Google Cloud Platform account (for Google Calendar integration)
- Notion API key (for Notion integration, optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/SmartTaskManager-TS-LangChain_.git
   cd SmartTaskManager-TS-LangChain_
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update the .env file with your API keys and configuration
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. Backend Environment Variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key
   NOTION_API_KEY=your_notion_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_session_secret
   ```

2. Google Cloud Platform Setup:
   - Create a new project in Google Cloud Console
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs (e.g., http://localhost:3000/api/auth/google/callback)

### Running the Application

#### Development Mode

1. Start the backend server:
   ```bash
   cd backend
   npm run start
   ```

2. In a separate terminal, start the frontend development server:
   ```bash
   cd frontend
   ng serve
   ```

3. Open your browser and navigate to `http://localhost:4200`

#### Production Build

1. Build the frontend:
   ```bash
   cd frontend
   ng build --configuration production
   ```

2. Build the backend:
   ```bash
   cd ../backend
   npm run build
   ```

3. Start the production server:
   ```bash
   npm start
   ```

## Features

- **AI-Powered Task Management**
  - Smart task suggestions using LangChain
  - Automatic task prioritization
  - Intelligent task summarization

- **Calendar Integration**
  - Sync tasks with Google Calendar
  - Smart scheduling suggestions
  - Event-based reminders

- **Productivity Tools**
  - Notion integration for notes and documentation
  - Task categorization and tagging
  - Progress tracking and analytics

- **User Experience**
  - Responsive web interface
  - Intuitive task management
  - Dark/Light theme support

## API Documentation

The backend provides a RESTful API for task management. For detailed API documentation, refer to the [API Documentation](./backend/API.md).

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [LangChain](https://langchain.com/) for the AI framework
- [Angular](https://angular.io/) for the frontend framework
- [Express](https://expressjs.com/) for the backend server
- [Google Calendar API](https://developers.google.com/calendar) for calendar integration
- [Notion API](https://developers.notion.com/) for notes and documentation integration
