Product Requirements Document (PRD): Bitcoin Price Prediction Game

1. Executive Summary

Build a web application where users predict if the price of Bitcoin (BTC/USD) will be higher or lower after 60 seconds. The project utilizes AWS Amplify Gen 2 for a TypeScript-first backend experience. The MVP focuses on a responsive user experience with client-side resolution logic, designed to allow "offline" users to resolve their guesses upon returning to the app.

2. User Stories (Functional Requirements)

Feature: Authentication & Profile

Story 2.1: As a new player, I want to sign up with my email and password so that I can create a unique account to track my score.

Story 2.2: As a returning player, I want to sign in so that I can access my previous score and history.

Store 2.2.1 As a user, I want to signout and redirect to homepage for re-login

Story 2.3: As a player, I want my score to be calculated from all my resolved guesses, so it accurately reflects my game history even if I refresh the page or close the browser.

Feature: Market Visibility

Story 2.4: As a player, I want to see the current live price of Bitcoin (USD) updated every minute so that I can make informed decisions.

Feature: Gameplay (The Guess)

Story 2.5: As a player, I want to click an "UP" or "DOWN" button to lock in my prediction for the next minute.

Story 2.6: As a player, I want to see a 60-second countdown timer immediately after guessing, so I know how long until the result.

Story 2.7: As a player, I want the guessing buttons to be disabled while a guess is active, so I don't accidentally make multiple overlapping guesses.

Story 2.7.1 As a player, I want to see the locked price when the timer starts

Feature: Resolution & Scoring

Story 2.8: As a player, I want to be automatically notified (Win/Loss) when the 60 seconds are up so I can see the result.

Acceptance Criteria: Win = +1 Point. Loss = -1 Point. Tie = 0 Points (Push).

Story 2.9: As a player, I want my score to update immediately on the UI after a resolution.

Feature: Offline / Resume Capability

Story 2.10: As a player, I want to be able to close my browser while a timer is running and return later (e.g., 10 minutes later) to see the result.

Story 2.11: As a system, when an offline player returns, I want to immediately resolve the pending guess using the current live price so the user doesn't have to wait.

3. UI/UX Requirements

Design Pattern: Feature-Sliced Design (FSD).

Iconography: Use lucide-react for all visual elements.

Theme: Modern, Dark Mode compatible.

Key Components:

Scoreboard: Top right. Icon: Trophy.

Price Widget: Central display. Clear, large font.

Controls:

UP Button: Green background. Icon: ArrowUp.

DOWN Button: Red background. Icon: ArrowDown.

Timer: Circular progress or text countdown. Icon: Timer.

4. Technical Architecture

4.1 Tech Stack

Frontend Framework: React (Vite)

Language: TypeScript

Styling: TailwindCSS

State Management: React Hooks + Amplify Data Client + Zustand

Backend Platform: AWS Amplify Gen 2 (Code-first)

Authentication: AWS Cognito (Managed via Amplify Auth)

Database: AWS DynamoDB (Managed via Amplify Data)

External API: Public Crypto API (e.g., Coinbase GET /products/BTC-USD/ticker)

4.2 Data Access Strategy

ORM Approach: We will use the Amplify Client generated from the schema to interact with DynamoDB (e.g., client.models.Guess.create()).

Authorization: The default mode is userPool. We use .authorization(allow => [allow.owner()]) to ensure users can only read/write their own data.

4.3 Database Schema (Amplify Gen 2)

File: amplify/data/resource.ts

import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Guess: a
    .model({
      startPrice: a.float().required(),
      direction: a.enum(['UP', 'DOWN']),
      status: a.enum(['PENDING', 'RESOLVED']),
      resolvedPrice: a.float(),
      score: a.integer(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.owner()]),
});

// Note: No Player model needed. Score is calculated by summing the 'score' field
// from all RESOLVED guesses for each user. This ensures accuracy and eliminates
// the need to maintain a separate score field.

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});


4.4 Frontend Architecture (Feature-Sliced Design)

The application is structured to decouple business logic from UI components.

src/
  app/                 # App-wide providers (Amplify, Theme)
  pages/               # Page composition (Home)
  widgets/             # Major UI blocks
    game-board/        # Widget: Composes 'make-guess', 'resolve-guess', 'bitcoin', 'score'
    history-panel/     # Widget: Composes 'view-history'
  features/            # Complex Business Logic
    auth-flow/         # Feature: Sign In / Sign Up forms
    make-guess/        # Feature: Logic to create a guess
    resolve-guess/     # Feature: Timer & Resolution Logic (Win/Loss calc)
    view-history/      # Feature: Logic to fetch & list past guesses
  entities/            # Domain Data & Dumb UI
    bitcoin/           # Entity: Price data model, Ticker UI
    guess/             # Entity: Guess types, Guess Card UI
    score/             # Entity: Score calculation logic, Scoreboard UI
    session/           # Entity: Current user auth state
  shared/              # Reusable foundation
    ui/                # Button, Card, Skeleton, Typography
    lib/               # formatCurrency, cn (tailwind-merge), date utils
    api/               # Shared Amplify Client instance


4.5 Resolution Strategy (Client-Side "Lazy" MVP)

To keep infrastructure costs low and complexity manageable for the MVP:

Logic: The frontend client tracks the startTime.

Trigger: When Date.now() > startTime + 60s, the client fetches the current Bitcoin price.

Calculation: The client compares the fetched price with the startPrice stored in the Guess record.

Update: The client writes the result (WIN/LOSS) and the score (+1, -1, or 0) to the Guess record in DynamoDB. The total score is then recalculated by summing all RESOLVED guess scores.

Security Note: This assumes a trusted client for the MVP. The Future Roadmap includes moving this logic to a server-side "Sweeper" (AWS Lambda) to prevent manipulation.