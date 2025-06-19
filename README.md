# Unity WebGL Game Host

This project provides a simple web server for hosting Unity WebGL games. It lets you upload zipped builds and serves them so they can be played directly in the browser.

## Features
- Upload a zipped Unity WebGL build from the `/upload` page.
- Automatically extracts the zip into `public/games/<game>/<timestamp>/`.
- Lists all uploaded builds on the home page with links to play.

## Requirements
- Node.js (tested with v20).

## Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000` in your browser.

## Directory Structure
- `public/` – Static files served by Express.
- `uploads/` – Temporary storage for uploaded zip files.
- `public/games/<game>/<timestamp>/` – Extracted builds.

## Notes
This is a minimal example meant as a starting point. Additional features like authentication or database storage can be added as needed.
