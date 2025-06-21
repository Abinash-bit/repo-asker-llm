# codent.io
codent.io is a web application that allows you to analyze and interact with GitHub repositories using AI. Simply provide a GitHub repository URL, and the application will fetch the repository's file structure and provide an interface to explore the code and ask questions about it.

## Features

- **Repository Loading:** Load any public GitHub repository by providing its URL.
- **File Explorer:** Navigate the repository's file structure with a collapsible file tree.
- **Code Viewer:** View the contents of any file with syntax highlighting.
- **AI-Powered Chat:** Ask questions about the repository, and get answers from an AI assistant powered by Google's Generative AI.
- **Responsive Design:** The application is designed to work on both desktop and mobile devices.

## Tech Stack

- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI:** [Google Generative AI](https://ai.google.dev/)
- **Routing:** [React Router](https://reactrouter.com/)
- **State Management:** [TanStack Query](https://tanstack.com/query/latest) & React Context
- **Forms:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (or [Bun](https://bun.sh/)) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    Using npm:
    ```sh
    npm install
    ```
    Or using bun:
    ```sh
    bun install
    ```

3.  **Set up environment variables:**
    You will need to create a `.env.local` file in the root of the project and add your Google AI API key:
    ```
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
    You can get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

-   **Development:**
    To run the app in development mode, execute the following command. This will start the application on `http://localhost:5173`.
    ```sh
    npm run dev
    ```

-   **Build:**
    To create a production build of the app, run:
    ```sh
    npm run build
    ```

-   **Preview Production Build:**
    To preview the production build locally, run:
    ```sh
    npm run preview
    ```

## Project Structure

The project follows a standard Vite + React project structure.

```
repo-asker-llm/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── ...
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Top-level page components
│   ├── services/        # Services for API calls (AI, repository)
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component with routing
│   ├── main.tsx         # Main entry point
│   └── ...
├── .env.local           # Environment variables (not committed)
├── package.json         # Project metadata and dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```
