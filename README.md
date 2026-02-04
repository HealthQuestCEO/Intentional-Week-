# Intentional Week

A minimal, playful-professional weekly planning PWA based on Laura Vanderkam's 9 Rules from *Tranquility by Tuesday*.

## Features

- **9 Rule Cards** — Track bedtime, movement, habits, adventures, and more
- **Timer** — Log time against tasks with Pomodoro mode support
- **Journal** — Daily entries with mood tracking using emoji scale
- **Mood Calendar** — Visual monthly view of your emotional patterns
- **Task Tracker** — Plan vs. actual time tracking for work tasks
- **Wellness Tools** — Box breathing, meditation timer, walk reminders, quick wins
- **Push Notifications** — Customizable reminders for each rule

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Auth:** Firebase Auth (Google Sign-in)
- **Storage:** localStorage (Netlify Blob ready)
- **PWA:** Vite PWA plugin with offline support
- **Icons:** Lucide React
- **Dates:** date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HealthQuestCEO/Intentional-Week-.git
cd Intentional-Week-
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── auth/         # Login, AuthProvider
│   ├── common/       # Button, Card, Modal, Input
│   ├── dashboard/    # Dashboard, RuleCard
│   ├── rules/        # Individual rule components
│   ├── timer/        # Timer widget and page
│   ├── journal/      # Journal, mood tracking
│   ├── calendar/     # Calendar view
│   ├── extras/       # Wellness tools
│   ├── settings/     # Settings page
│   └── layout/       # Header, BottomNav, Layout
├── hooks/            # Custom React hooks
├── services/         # Firebase, storage, notifications
├── utils/            # Constants, helpers, date utils
└── styles/           # Global CSS, Tailwind config
```

## The 9 Rules

1. **Give yourself a bedtime** — Consistent sleep schedule
2. **Plan on Fridays** — Weekly planning with Career/Relationships/Self
3. **Move by 3pm** — Daily movement before afternoon
4. **Three times a week is a habit** — Track habits 3x/week
5. **Create a backup slot** — Buffer time for the unexpected
6. **One big adventure, one little adventure** — Weekly adventures
7. **Take one night for you** — Personal time
8. **Batch the little things** — Group small tasks
9. **Effortful before effortless** — Meaningful activities first

## Color Palette

| Rule | Color | Hex |
|------|-------|-----|
| Bedtime | Orchid Mist | `#9A9BB0` |
| Friday Planning | Balanced Teal | `#3D7A7A` |
| Movement | Gelato Mint | `#B8C9A8` |
| Habits | Sunrise Yellow | `#D4A54A` |
| Backup Slot | Rainfall | `#7A9BA8` |
| Adventures | Sweet Akito Rose | `#D4856A` |
| Your Night | Teasel Lilac | `#B8B4C8` |
| Batching | Barley Yellow | `#D9C9A8` |
| Effortful First | Pale Coral | `#C9A89A` |

**Background:** Vanilla Sky `#F5F0E8`
**Accent:** Balanced Teal `#3D7A7A`

## Firebase Setup

The app uses Firebase Authentication with Google Sign-in. The Firebase project is already configured at:
- Project: `intentional-week`
- Console: https://console.firebase.google.com/u/0/project/intentional-week/overview

Make sure Google Sign-in is enabled in Firebase Console → Authentication → Sign-in method.

## Deployment

The app is configured for Netlify deployment. Just connect your GitHub repo to Netlify and it will auto-deploy on push.

Build settings:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

## Credits

Inspired by *Tranquility by Tuesday: 9 Ways to Calm the Chaos and Make Time for What Matters* by [Laura Vanderkam](https://lauravanderkam.com/).

## License

MIT
