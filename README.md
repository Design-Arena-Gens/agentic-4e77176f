# Shortform Studio

Shortform Studio is an AI agent that turns a creative brief into a production-ready YouTube Shorts package—hook, narration beats, shot plan, B-roll cues, sonic palette, and caption stack—within seconds.

## Quickstart

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`, paste your brief, and let the agent architect the short.

## Configuration

Set your OpenAI credential before running locally or deploying:

```bash
export OPENAI_API_KEY=your_api_key_here
```

## Production Build

```bash
npm run build
npm start
```

The app is optimized for deployment on Vercel. Use `vercel deploy --prod` when you are ready to ship.
