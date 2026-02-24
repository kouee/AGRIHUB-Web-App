# AGRIHUB: Hydroponic Monitoring & Automation System

This is a website with a dashboard for the AGRIHUB Project.

## Getting Started Locally

To run this project on your local machine, follow these steps:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (which includes npm).

### 1. Install Dependencies

Open your terminal in the project's root directory and run the following command to install all the necessary packages:

```bash
npm install
```

### 2. Set Up Environment Variables

The project uses Genkit for its AI features, which requires a Gemini API key. This is optional if you only plan to work on the UI and dashboard.

1.  Create a new file in the root of your project named `.env.local`.
2.  Add your API key to this file:

```
GEMINI_API_KEY="YOUR_API_KEY_HERE"
```
Replace `"YOUR_API_KEY_HERE"` with your actual Google AI Gemini API key.

### 3. Run the Development Servers

For the full application including AI features, you will need to run two separate processes.

**Terminal 1: Run the Next.js App**

This command starts the main web application. All visual components, charts, and the dashboard will work with just this server running.

```bash
npm run dev
```

The app will be available at [http://localhost:9002](http://localhost:9002).

**Terminal 2: Run the Genkit AI Server (Optional)**

This command starts the local server that handles AI-powered features. This is only necessary if you are developing or using AI functionality.

```bash
npm run genkit:dev
```
