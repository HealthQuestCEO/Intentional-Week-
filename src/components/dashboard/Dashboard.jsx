import { useState } from 'react';
import { Layout } from '../layout/Layout';
import { RuleCard } from './RuleCard';
import { BedtimeCard } from '../rules/BedtimeCard';
import { FridayPlanCard } from '../rules/FridayPlanCard';
import { MoveBy3pmCard } from '../rules/MoveBy3pmCard';
import { HabitCard } from '../rules/HabitCard';
import { BackupSlotCard } from '../rules/BackupSlotCard';
import { AdventuresCard } from '../rules/AdventuresCard';
import { NightForYouCard } from '../rules/NightForYouCard';
import { BatchTasksCard } from '../rules/BatchTasksCard';
import { EffortfulFirstCard } from '../rules/EffortfulFirstCard';
import { TimerWidget } from '../timer/TimerWidget';
import { useWeekData } from '../../hooks/useWeekData';
import { RULES } from '../../utils/constants';
import { previousWeek, nextWeek, checkIsToday } from '../../utils/dateUtils';

export function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { weekData, loading } = useWeekData(currentDate);

  const handlePrevWeek = () => {
    setCurrentDate(prev => previousWeek(prev));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => nextWeek(prev));
  };

  const getRuleStatus = (ruleId) => {
    if (!weekData) return null;

    switch (ruleId) {
      case 'bedtime': {
        const logs = weekData.bedtime?.logs || {};
        const hitCount = Object.values(logs).filter(l => l?.hit).length;
        return hitCount > 0 ? `${hitCount}/7` : null;
      }
      case 'planFridays':
        return weekData.fridayPlan?.done ? 'complete' : null;
      case 'moveBy3pm': {
        const moves = weekData.moveBy3pm || {};
        const moveCount = Object.values(moves).filter(m => m?.moved).length;
        return moveCount > 0 ? `${moveCount}/7` : null;
      }
      case 'habits': {
        const habits = weekData.habits || [];
        const completed = habits.filter(h => {
          const daysHit = Object.values(h.days || {}).filter(Boolean).length;
          return daysHit >= 3;
        }).length;
        return habits.length > 0 ? `${completed}/${habits.length}` : null;
      }
      case 'backupSlot':
        return weekData.backupSlot?.slot ? (weekData.backupSlot?.used !== null ? 'complete' : '1') : null;
      case 'adventures': {
        const adv = weekData.adventures || {};
        const count = (adv.big?.completed ? 1 : 0) + (adv.little?.completed ? 1 : 0);
        return count > 0 ? `${count}/2` : null;
      }
      case 'nightForYou':
        return weekData.nightForYou?.took ? 'complete' : (weekData.nightForYou?.night ? '1' : null);
      case 'batchTasks': {
        const batch = weekData.batchTasks || {};
        const completed = batch.completed?.length || 0;
        const total = batch.tasks?.length || 0;
        return total > 0 ? `${completed}/${total}` : null;
      }
      case 'effortfulFirst': {
        const days = weekData.effortfulFirst?.days || {};
        const count = Object.values(days).filter(Boolean).length;
        return count > 0 ? `${count}/7` : null;
      }
      default:
        return null;
    }
  };

  const renderRuleContent = (rule) => {
    switch (rule.id) {
      case 'bedtime':
        return <BedtimeCard currentDate={currentDate} />;
      case 'planFridays':
        return <FridayPlanCard currentDate={currentDate} />;
      case 'moveBy3pm':
        return <MoveBy3pmCard currentDate={currentDate} />;
      case 'habits':
        return <HabitCard currentDate={currentDate} />;
      case 'backupSlot':
        return <BackupSlotCard currentDate={currentDate} />;
      case 'adventures':
        return <AdventuresCard currentDate={currentDate} />;
      case 'nightForYou':
        return <NightForYouCard currentDate={currentDate} />;
      case 'batchTasks':
        return <BatchTasksCard currentDate={currentDate} />;
      case 'effortfulFirst':
        return <EffortfulFirstCard currentDate={currentDate} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Layout showWeekNav currentDate={currentDate} onPrevWeek={handlePrevWeek} onNextWeek={handleNextWeek}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      showWeekNav
      currentDate={currentDate}
      onPrevWeek={handlePrevWeek}
      onNextWeek={handleNextWeek}
    >
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Rule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RULES.map((rule) => {
            const status = getRuleStatus(rule.id);
            return (
              <RuleCard
                key={rule.id}
                rule={rule}
                status={status === 'complete' ? 'complete' : null}
                progress={status !== 'complete' ? status : null}
              >
                {renderRuleContent(rule)}
              </RuleCard>
            );
          })}
        </div>

        {/* Floating Timer Widget */}
        <TimerWidget />
      </div>
    </Layout>
  );
}

export default Dashboard;
