# Welcome to Bora-GPT

This is a Chat-GPT style application, intended to demonstrate the use of ReAct prompting via OpenAI function calling.

## Cool Technologies Used

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [OpenAI](https://platform.openai.com/docs/guides/function-calling)
- [Prisma](https://prisma.io)

## Getting Started

### Environment Variables

You'll need to define these to interact with the external APIs

- **OPENAI_API_KEY** (you can get one directly from OpenAI. I am on one of the minimum paid tiers)
- **OPENAI_MODEL** (I chose one of the newer ones gpt-4o-mini)
- **OPEN_WEATHER_API_KEY** ([you can get one here](https://www.weatherbit.io/))
- **DATABASE_URL** (use this to connect to your local PostgreSQL db. I left my example in .env.example)

### Get up and running

- yarn install
- yarn db:generate (run migrations on the db)
- yarn run dev

## Application Preview

![bora-gpt-2](https://github.com/user-attachments/assets/a8bab62f-db93-4bb6-8d75-f07ee5021790)
