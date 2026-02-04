import { useState } from 'react';
import { Wind, Timer, Footprints, Sparkles } from 'lucide-react';
import { Layout } from '../layout/Layout';
import { BoxBreathing } from './BoxBreathing';
import { MeditationTimer } from './MeditationTimer';
import { WalkReminder } from './WalkReminder';
import { QuickWins } from './QuickWins';

const TOOLS = [
  {
    id: 'breathing',
    name: 'Box Breathing',
    description: 'Calm your mind with 4-4-4-4 breathing',
    icon: Wind,
    color: 'bg-balanced-teal',
    component: BoxBreathing,
  },
  {
    id: 'meditation',
    name: 'Meditation Timer',
    description: 'Timed meditation with soft chime',
    icon: Timer,
    color: 'bg-teasel-lilac',
    component: MeditationTimer,
  },
  {
    id: 'walk',
    name: 'Walk Reminder',
    description: 'Set a reminder to take a walk',
    icon: Footprints,
    color: 'bg-gelato-mint',
    component: WalkReminder,
  },
  {
    id: 'quickwins',
    name: 'Quick Wins',
    description: 'Get a simple task for instant accomplishment',
    icon: Sparkles,
    color: 'bg-sunrise-yellow',
    component: QuickWins,
  },
];

export function ExtrasPanel() {
  const [activeTool, setActiveTool] = useState(null);

  const ActiveComponent = activeTool ? TOOLS.find(t => t.id === activeTool)?.component : null;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-charcoal mb-2">Wellness Tools</h1>
        <p className="text-charcoal/60 mb-6">
          Quick tools to help you reset and recharge
        </p>

        {activeTool ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {/* Back button */}
            <button
              onClick={() => setActiveTool(null)}
              className="text-sm text-balanced-teal hover:underline mb-4"
            >
              ← Back to tools
            </button>

            {/* Tool title */}
            <h2 className="text-xl font-semibold text-charcoal mb-6 text-center">
              {TOOLS.find(t => t.id === activeTool)?.name}
            </h2>

            {/* Tool component */}
            {ActiveComponent && <ActiveComponent />}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="bg-white rounded-xl p-4 text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`${tool.color} w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal">{tool.name}</h3>
                    <p className="text-sm text-charcoal/60">{tool.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Footer attribution */}
        <footer className="mt-12 text-center text-sm text-charcoal/40">
          <p>
            Inspired by <em>Tranquility by Tuesday</em> by Laura Vanderkam
          </p>
        </footer>
      </div>
    </Layout>
  );
}

export default ExtrasPanel;
