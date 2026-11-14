# 🌍 WanderMind AI – AI-Powered Travel Discovery

WanderMind AI is an AI-powered travel discovery application that helps users discover destinations and create personalised travel itineraries based on their preferences, trip duration, and **total trip budget**.

Instead of spending hours searching for destinations, users can describe the kind of trip they want and explore recommendations that match their travel preferences.

> **Project status:** Working demo / active development.

## ✨ Features

- **AI-powered destination discovery** – Explore destinations based on travel preferences and interests.
- **Budget-aware recommendations** – Find destinations that fit within the user's maximum total trip budget.
- **Personalised travel guides** – Explore destination information and travel suggestions.
- **AI-generated itineraries** – Generate day-wise travel plans based on trip duration and preferences.
- **Budget breakdown** – View estimated costs for accommodation, food, local transport, activities, and other expenses.
- **Local AI integration** – Uses Ollama to run a locally hosted language model.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express.js |
| AI integration | Ollama |
| Default AI model | `qwen2.5:3b` |
| API communication | REST APIs |

## 📋 Prerequisites

Install the following before setting up the project:

1. **Node.js and npm** – https://nodejs.org/
2. **Git** – https://git-scm.com/
3. **Ollama** – https://ollama.com/

A current supported Node.js LTS release is recommended.

## 🚀 Getting Started

### 1. Clone the repository

Replace the placeholder with the URL of your GitHub repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd WanderMind-AI
```

### 2. Install frontend dependencies

From the project root directory:

```bash
npm install
```

### 3. Configure the frontend

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000
```

The frontend must use this value when constructing backend API requests. If your frontend currently uses a different environment variable name, use that name instead.

### 4. Install backend dependencies

Open a second terminal and navigate to the backend directory:

```bash
cd server
npm install
```

### 5. Configure the backend

Create a `.env` file inside the `server` directory:

```env
PORT=5000
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b
```

These values are for local development. Do not commit `.env` files or private credentials to GitHub.

### 6. Install and download the Ollama model

Install Ollama from:

https://ollama.com/download

Download the model used by the project:

```bash
ollama pull qwen2.5:3b
```

Check that the model is installed:

```bash
ollama list
```

You can test it with:

```bash
ollama run qwen2.5:3b "Suggest a peaceful travel destination."
```

Ollama should be running locally and accessible at:

```text
http://localhost:11434
```

### 7. Start the backend

From the `server` directory, start the backend using the script defined in `server/package.json`.

If the package has a `start` script:

```bash
npm start
```

If it does not, and the backend entry point is `server.js`, run:

```bash
node server.js
```

The backend is expected to listen on:

```text
http://localhost:5000
```

### 8. Start the frontend

Open another terminal, return to the project root, and start the Vite development server:

```bash
npm run dev
```

Open the local URL printed by Vite in your browser. The default is usually:

```text
http://localhost:5173
```

You should now be able to use WanderMind AI locally.

## 🔌 Backend API

The backend includes REST endpoints for the application's main features. The current development endpoints include:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Check backend health |
| `POST` | `/api/recommend` | Request destination recommendations |
| `POST` | `/api/ai-recommend` | AI-powered recommendation flow |
| `POST` | `/api/destination-details` | Retrieve destination details |
| `POST` | `/api/generate-itinerary` | Generate a personalised itinerary |

The backend base URL is `http://localhost:5000` by default.

> If your local `server.js` uses different route names, treat the route definitions in that file as the source of truth and update this table accordingly.

## 🧠 How the AI integration works

WanderMind AI uses Ollama to run a language model locally. The Node.js backend sends prompts to the Ollama API and uses the model's response to support travel recommendations and itinerary generation.

Default configuration:

```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b
```

The backend also contains fallback logic for supported recommendation and itinerary flows when AI generation is unavailable.

## 💰 Budget handling

The budget entered by the user represents the **maximum estimated budget for the entire trip**, not an accommodation cost per night.

The itinerary response includes an estimated breakdown for:

- Accommodation
- Food
- Local transport
- Activities
- Other expenses
- Total estimated trip cost

These values are planning estimates. They are not live flight, hotel, transport, or activity prices. Confirm actual prices with travel providers before booking.

## 🧪 Build the frontend

To create a production build:

```bash
npm run build
```

Vite normally writes the generated frontend files to the `dist` directory.

To run the project locally during development, use `npm run dev`.

## 🛠️ Troubleshooting

### Frontend cannot connect to the backend

- Confirm that the backend is running.
- Confirm that the backend is listening on port `5000`.
- Check that the frontend environment variable points to the correct backend URL.
- Restart the Vite development server after changing frontend environment variables.
- Check the browser console and backend terminal for errors.

### Ollama connection error

- Confirm that Ollama is installed and running.
- Check the installed models:

  ```bash
  ollama list
  ```

- Download the model if it is missing:

  ```bash
  ollama pull qwen2.5:3b
  ```

- Confirm that `OLLAMA_URL` and `OLLAMA_MODEL` in `server/.env` are correct.

### AI response takes a long time

Local model performance depends on available RAM, CPU, and GPU resources. The first request may take longer while the model loads.

### Backend dependencies are missing

From the backend directory, run:

```bash
npm install
```

## 🔐 GitHub security

Do not commit environment files, credentials, or dependency folders.

A `.gitignore` should include at least:

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
```

If you want to help other developers configure the project, commit safe example files such as `.env.example` with placeholder values only. Never put real API keys, passwords, or private credentials in those files.

## 📁 Project structure

The exact structure may vary depending on the repository. A typical layout for this project is:

```text
WanderMind-AI/
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env              # Create locally; do not commit
├── src/                  # Frontend source
├── public/               # Static frontend assets
├── package.json
├── package-lock.json
├── vite.config.ts
├── .env                  # Create locally; do not commit
└── README.md
```

Use the actual files in the repository as the source of truth if your folder names differ.

## 🎯 Project goal

WanderMind AI aims to make travel discovery simpler and more personalised by combining AI-assisted destination recommendations with budget-aware trip planning.

**Discover destinations. Plan smarter. Travel better.**

---

Built as part of the **Product Portfolio Sprint at Product Space**.
