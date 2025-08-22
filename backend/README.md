# Smart Task Manager Backend

A powerful, AI-driven task management API built with Node.js, TypeScript, and LangChain. This backend provides intelligent task processing, prioritization, and reminder capabilities through a clean RESTful API.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── agents/            # AI agents for task management
│   ├── chains/            # LangChain processing chains
│   ├── config/            # Configuration files
│   ├── controllers/       # API controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # Database models
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic
│   ├── tools/             # External tool integrations
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── index.ts           # Application entry point
│   └── loadEnv.ts         # Environment configuration
├── .env.example           # Example environment variables
└── package.json           # Project dependencies
```

## 🔑 Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:

```env
# -----------------------------
# 🗃️ Notion Config
# -----------------------------
NOTION_API_KEY=ntn_NotionKey              # Your Notion API key
NOTION_DATABASE_ID=NotionTaskDBId         # Your Notion Task Database ID
OPENAI_API_KEY=sk-proj-openAIKey          # OpenAI API key for AI features
HUGGINGFACE_API_TOKEN=hf_token            # Hugging Face API token
NOTION_GOOGLE_TOKENS_DB_ID=TokensDBId     # Notion DB ID for storing Google tokens

# -----------------------------
# 🌐 Server / Backend Config
# -----------------------------
PORT=3003                                 # Port for the backend server

# -----------------------------
# 📅 Google OAuth Config
# -----------------------------
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3003/api/google/oauth2callback
GOOGLE_CALENDAR_ID=primary                # or your specific calendar ID
GOOGLE_SCOPES=https://www.googleapis.com/auth/calendar

# -----------------------------
# 🔐 Session & Security
# -----------------------------
SESSION_SECRET=replace_with_a_long_random_string  # Used for session encryption

## 🚀 Development

### Installation

```bash
npm install
```

### Running the Server

```bash
# Development mode with hot-reload
npm run dev

# Production build
npm run build
npm start
```

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 📚 API Documentation

### Authentication URL for Google OAuth
GET http://localhost:3003/api/google/auth/url?user_id=email@gmail.com

### Tasks

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Google Calendar Integration

- `GET /api/calendar/events` - List calendar events
- `POST /api/calendar/events` - Create calendar event from task
- `DELETE /api/calendar/events/:eventId` - Delete calendar event

## 🔄 Environment Variables Reference

### Notion Configuration
| Variable | Required | Description |
|----------|----------|-------------|
| `NOTION_API_KEY` | Yes | Your Notion integration API key |
| `NOTION_DATABASE_ID` | Yes | ID of your Notion tasks database |
| `NOTION_GOOGLE_TOKENS_DB_ID` | Yes | Notion DB ID for storing Google OAuth tokens |

### Server Configuration
| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Port number the server will run on (default: 3003) |

### Google OAuth Configuration
| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth 2.0 Client Secret |
| `GOOGLE_REDIRECT_URI` | Yes | Callback URL for Google OAuth |
| `GOOGLE_CALENDAR_ID` | No | Google Calendar ID (default: 'primary') |
| `GOOGLE_SCOPES` | No | Required Google API scopes |

### AI Configuration
| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | No | API key for OpenAI services |
| `HUGGINGFACE_API_TOKEN` | No | API token for Hugging Face models |

### Security
| Variable | Required | Description |
|----------|----------|-------------|
| `SESSION_SECRET` | Yes | Secret key for session encryption |

## 🌟 Features

- **AI-Powered Task Management**
  - Smart task prioritization using Mistral 7B
  - Natural language task summarization
  - Context-aware reminder generation

- **Robust API**
  - RESTful endpoints for all operations
  - TypeScript-first development
  - Comprehensive error handling
  - Request validation

- **Notion Integration**
  - Seamless sync with Notion databases
  - Real-time data consistency
  - Automatic conflict resolution

- **Intelligent Processing**
  - LangChain-powered AI workflows
  - Customizable reminder rules
  - Priority-based task organization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Notion API key
- Hugging Face API key
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smart-task-manager.git
   cd smart-task-manager/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3003
   NODE_ENV=development
   NOTION_API_KEY=your_notion_api_key
   NOTION_DATABASE_ID=your_notion_database_id
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

### Running the Server

#### Development Mode
```bash
npm run dev
```
Starts the server with hot-reload using `ts-node-dev`.

#### Production Mode
```bash
npm run build
npm start
```

#### Running Tests
```bash
npm test
```

## 📚 API Documentation

### Base URL
```
http://localhost:3003/api
```

### Endpoints

#### Tasks (go to env sample file for more details, named as ".env.example" in backend)
- `GET /tasks` - List all tasks
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get a specific task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

#### AI Features
- `POST /ai/summarize` - Generate task summary
- `POST /ai/prioritize` - Get AI-prioritized tasks
- `POST /ai/reminders` - Generate smart reminders

### Example Requests

**Create a Task**
```bash
curl -X POST http://localhost:3003/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive docs for all modules",
    "dueDate": "2024-03-01",
    "priority": "high"
  }'
```

**Get AI-Prioritized Tasks**
```bash
curl -X POST http://localhost:3003/api/ai/prioritize \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": [
      {"id": "1", "title": "Write tests", "priority": "medium"},
      {"id": "2", "title": "Fix critical bug", "priority": "high"}
    ]
  }'
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Port to run the server on (default: 3003) |
| `NODE_ENV` | No | Environment (development/production) |
| `NOTION_API_KEY` | Yes | Your Notion integration token |
| `NOTION_DATABASE_ID` | Yes | ID of your Notion database |
| `HUGGINGFACE_API_KEY` | Yes | Hugging Face API key for AI features |

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Test coverage:
```bash
npm run test:coverage
```

## 🛠 Development

### Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Data models
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── tests/             # Test files
├── .env.example       # Example environment variables
└── tsconfig.json      # TypeScript configuration
```

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode

Run linter:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LangChain](https://langchain.com/)
- [Notion API](https://developers.notion.com/)
- [Hugging Face](https://huggingface.co/)
- [Express.js](https://expressjs.com/)
