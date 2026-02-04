// Color palette (Lycke collection)
export const RULE_COLORS = {
  bedtime: '#9A9BB0',        // Orchid Mist
  planFridays: '#3D7A7A',    // Balanced Teal
  moveBy3pm: '#B8C9A8',      // Gelato Mint
  habits: '#D4A54A',         // Sunrise Yellow
  backupSlot: '#7A9BA8',     // Rainfall
  adventures: '#D4856A',     // Sweet Akito Rose
  nightForYou: '#B8B4C8',    // Teasel Lilac
  batchTasks: '#D9C9A8',     // Barley Yellow
  effortfulFirst: '#C9A89A', // Pale Coral
};

export const THEME = {
  background: '#F5F0E8',     // Vanilla Sky
  text: '#2D2D2D',           // Dark charcoal
  accent: '#3D7A7A',         // Balanced Teal
};

// Mood emojis (Microsoft Fluent 3D)
export const MOOD_EMOJIS = {
  1: { name: 'crying-face', label: 'Rough', file: '/emojis/crying-face.png' },
  2: { name: 'worried-face', label: 'Meh', file: '/emojis/worried-face.png' },
  3: { name: 'slightly-smiling-face', label: 'Okay', file: '/emojis/slightly-smiling-face.png' },
  4: { name: 'grinning-face-with-big-eyes', label: 'Good', file: '/emojis/grinning-face-with-big-eyes.png' },
  5: { name: 'star-struck', label: 'Great', file: '/emojis/star-struck.png' },
};

// The 9 Rules
export const RULES = [
  {
    id: 'bedtime',
    number: 1,
    name: 'Give yourself a bedtime',
    shortName: 'Bedtime',
    description: 'Go to sleep at about the same time every night unless you have a good reason not to.',
    color: RULE_COLORS.bedtime,
    icon: 'Moon'
  },
  {
    id: 'planFridays',
    number: 2,
    name: 'Plan on Fridays',
    shortName: 'Friday Planning',
    description: 'Think through your weeks, holistically, before you\'re in them.',
    color: RULE_COLORS.planFridays,
    icon: 'Calendar'
  },
  {
    id: 'moveBy3pm',
    number: 3,
    name: 'Move by 3pm',
    shortName: 'Movement',
    description: 'Do some form of physical activity for ten minutes in the first half of every day.',
    color: RULE_COLORS.moveBy3pm,
    icon: 'Activity'
  },
  {
    id: 'habits',
    number: 4,
    name: 'Three times a week is a habit',
    shortName: '3x Habits',
    description: 'Things don\'t have to happen daily to count. Aim for 3x/week.',
    color: RULE_COLORS.habits,
    icon: 'Repeat'
  },
  {
    id: 'backupSlot',
    number: 5,
    name: 'Create a backup slot',
    shortName: 'Backup Slot',
    description: 'Build buffer time into your week for when things go sideways.',
    color: RULE_COLORS.backupSlot,
    icon: 'Shield'
  },
  {
    id: 'adventures',
    number: 6,
    name: 'One big adventure, one little adventure',
    shortName: 'Adventures',
    description: 'Plan something to look forward to each week, both large and small.',
    color: RULE_COLORS.adventures,
    icon: 'Compass'
  },
  {
    id: 'nightForYou',
    number: 7,
    name: 'Take one night for you',
    shortName: 'Your Night',
    description: 'Carve out personal time that\'s just yours.',
    color: RULE_COLORS.nightForYou,
    icon: 'Star'
  },
  {
    id: 'batchTasks',
    number: 8,
    name: 'Batch the little things',
    shortName: 'Batching',
    description: 'Group small tasks together instead of letting them fragment your day.',
    color: RULE_COLORS.batchTasks,
    icon: 'Layers'
  },
  {
    id: 'effortfulFirst',
    number: 9,
    name: 'Effortful before effortless',
    shortName: 'Effortful First',
    description: 'Do effortful fun (reading, hobbies) before defaulting to screens.',
    color: RULE_COLORS.effortfulFirst,
    icon: 'BookOpen'
  },
];

// Journal prompts
export const JOURNAL_PROMPTS = [
  { id: 'onYourMind', label: "What's on your mind?" },
  { id: 'gratefulFor', label: "What are you grateful for?" },
  { id: 'wentWell', label: "What went well today?" },
  { id: 'doDifferently', label: "What's one thing you'd do differently?" },
];

// Quick wins
export const QUICK_WINS = [
  "Text a friend",
  "Drink a glass of water",
  "Step outside for 2 minutes",
  "Stretch for 1 minute",
  "Write down one thing you're grateful for",
  "Clear one thing off your desk",
  "Take 3 deep breaths",
  "Look out the window for 30 seconds",
  "Stand up and shake it out",
  "Send someone a compliment",
  "Put on your favorite song",
  "Tidy one small area",
  "Write down tomorrow's top priority",
  "Do 10 jumping jacks",
  "Make your bed",
];

// Days of the week
export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Timer presets (in minutes)
export const TIMER_PRESETS = {
  pomodoro: {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsBeforeLongBreak: 4,
  },
  meditation: [5, 10, 15, 20, 30],
};

// Default reminder times
export const DEFAULT_REMINDERS = {
  bedtime: { enabled: true, offsetMinutes: 30 },
  planOnFridays: { enabled: true, day: 'Friday', time: '14:00' },
  moveBy3pm: { enabled: true, times: ['13:00', '14:30'] },
  habits: { enabled: true, time: '19:00' },
  backupSlot: { enabled: true, time: '20:00' },
  adventures: { enabled: true, day: 'Sunday', time: '18:00' },
  nightForYou: { enabled: true, time: '08:00' },
  batchTasks: { enabled: false, time: null },
  effortfulFirst: { enabled: true, time: '18:00' },
};

// Task statuses
export const TASK_STATUS = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
  ROLLED_OVER: 'rolled-over',
};
