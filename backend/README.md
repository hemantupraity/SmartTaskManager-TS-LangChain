# Smart Task Manager Backend

A powerful, AI-driven task management API built with Node.js, TypeScript, and LangChain. This backend provides intelligent task processing, prioritization, and reminder capabilities through a clean RESTful API.

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

#### Tasks
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
