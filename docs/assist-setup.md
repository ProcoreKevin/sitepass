# HELIX Assist - Simulated Chat

## Overview

The HELIX Assist feature provides an AI-powered chat interface for construction project management. This template version uses **simulated responses** to demonstrate the interface without requiring external API keys.

## Implementation

### Simulated Chat API

The chat functionality is powered by a simulated API endpoint at `app/api/assist-chat/route.ts` that:
- Returns pre-defined responses to showcase the interface
- Simulates typing effect for realistic chat experience
- Requires no external API keys or configuration

### Components

1. **AssistPanel** (`components/assist-panel.tsx`)
   - Main chat interface with tabs for Current Chat, History, and Learn More
   - Enhanced welcome message explaining the demo nature
   - Message display with user/assistant differentiation

2. **AssistSearchPopover** (`components/assist-search-popover.tsx`)
   - Quick access search interface
   - Prompt suggestions for common tasks
   - Opens Assist panel with context

### Upgrading to Real AI

To connect a real AI service:

1. Replace the simulated API in `app/api/assist-chat/route.ts` with your AI provider
2. Add necessary API keys to environment variables
3. Install required SDK packages (e.g., `@ai-sdk/openai`, `@ai-sdk/anthropic`)
4. Update the welcome message in `assist-panel.tsx` to remove the demo notice

### Supported AI Providers

The AI SDK supports multiple providers:
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Google (Gemini)
- And many more via the Vercel AI SDK

See the [AI SDK documentation](https://sdk.vercel.ai) for integration guides.
