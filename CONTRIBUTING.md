# Contributing to AniStream

Thank you for your interest in contributing to AniStream! This guide will help you get started with the project.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [Rust](https://www.rust-lang.org/tools/install)

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/AniStream.git
    cd AniStream
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```

## Development

To start the development server with hot-reload for both the frontend and backend:

```bash
npm run tauri dev
```

This will launch the Tauri window. Changes to the Vue code in `src/` or Rust code in `src-tauri/` will trigger an automatic reload or rebuild.

### Other Useful Commands

- `npm run dev`: Start only the Vite development server (frontend only).
- `npm run build`: Build the frontend and the Tauri application.
- `npm run tauri build`: Build the production-ready installer.

## How to Contribute

### Reporting Bugs or Requesting Features

Please use the [GitHub Issues](https://github.com/your-username/AniStream/issues) to report bugs or suggest new features. Provide as much detail as possible, including steps to reproduce for bugs.

### Pull Requests

1.  Create a new branch for your feature or bugfix:
    ```bash
    git checkout -b feature/<issue_number>
    # or
    git checkout -b fix/<issue_number>
    ```
2.  Make your changes and ensure they follow the project's coding style.
3.  Commit your changes with descriptive commit messages.
4.  Push to your fork:
    ```bash
    git push origin feature/<issue_number>
    # or
    git push origin fix/<issue_number>
    ```
5.  Open a **Pull Request** against the `master` branch of the original repository.

## Translations

We welcome translations! Here are the rules for translation contributions:

- **Translation Fixes**: Improving existing translations does not require an issue. Use a meaningful branch name (e.g., `fix/german-translation`).
- **New Languages**: Adding a new language requires an [issue](https://github.com/your-username/AniStream/issues) first. The branch name must follow the standard feature format: `feature/<issue_number>`.

## Coding Standards

- Follow the existing code style in the project.
- Use TypeScript for frontend development.
- Ensure Rust code is formatted using `cargo fmt`.
- Keep components small and focused.

Thank you for helping make AniStream better!
