'use client';

import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Target, Plus, Trash2, TrendingUp, Calendar, DollarSign, X, CheckCircle } from 'lucide-react';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: string;
  status: string;
}

interface Summary {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalTarget: number;
  totalSaved: number;
  overallProgress: string;
}

export default function SavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddProgressModal, setShowAddProgressModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  // Add goal form state
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', deadline: '', category: 'other' });
  const [addProgress, setAddProgress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const [goalsData, summaryData] = await Promise.all([
        apiService.getSavingsGoals(),
        apiService.getSavingsGoalSummary()
      ]);
      setGoals(goalsData as SavingsGoal[]);
      setSummary(summaryData as Summary);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const amount = parseFloat(newGoal.targetAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid target amount');
        return;
      }

      await apiService.createGoal({
        name: newGoal.name,
        targetAmount: amount,
        deadline: newGoal.deadline || undefined,
        category: newGoal.category
      });
      
      setNewGoal({ name: '', targetAmount: '', deadline: '', category: 'other' });
      setShowAddModal(false);
      loadGoals();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const amount = parseFloat(addProgress);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      if (selectedGoal) {
        await apiService.addGoalProgress(selectedGoal.id, amount);
        setAddProgress('');
        setShowAddProgressModal(false);
        setSelectedGoal(null);
        loadGoals();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      await apiService.deleteGoal(id);
      loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-emerald-500';
    if (progress >= 25) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency': return <Target className="w-5 h-5" />;
      case 'vacation': return <Calendar className="w-5 h-5" />;
      case 'investment': return <TrendingUp className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-white">Savings Goals</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f2e] rounded-2xl p-6 shadow-lg border border-gray-800/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-white">Savings Goals</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
            <p className="text-gray-400 text-xs mb-1">Total Goals</p>
            <p className="text-white font-bold text-lg">{summary.totalGoals}</p>
          </div>
          <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
            <p className="text-gray-400 text-xs mb-1">Active</p>
            <p className="text-emerald-400 font-bold text-lg">{summary.activeGoals}</p>
          </div>
          <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
            <p className="text-gray-400 text-xs mb-1">Total Saved</p>
            <p className="text-emerald-400 font-bold text-lg">${summary.totalSaved.toFixed(0)}</p>
          </div>
          <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/50">
            <p className="text-gray-400 text-xs mb-1">Progress</p>
            <p className="text-emerald-400 font-bold text-lg">{summary.overallProgress}%</p>
          </div>
        </div>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No savings goals yet. Create your first goal to start tracking!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = progress >= 100;
            
            return (
              <div
                key={goal.id}
                className={`bg-gray-900/30 rounded-xl p-4 border ${isCompleted ? 'border-emerald-500/30' : 'border-gray-800/50'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-emerald-500/10' : 'bg-gray-800/50'}`}>
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{goal.name}</h3>
                      <p className="text-gray-400 text-xs capitalize">{goal.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">${goal.currentAmount.toFixed(0)} of ${goal.targetAmount.toFixed(0)}</span>
                    <span className={isCompleted ? 'text-emerald-400' : 'text-gray-400'}>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`${getProgressColor(progress)} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Add Progress Button */}
                {!isCompleted && (
                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setShowAddProgressModal(true);
                    }}
                    className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 py-2 px-4 rounded-lg text-sm font-medium transition-all"
                  >
                    Add Progress
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1f2e] rounded-2xl max-w-md w-full shadow-2xl border border-gray-800/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Create Savings Goal</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="e.g., Emergency Fund"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Target Amount ($)</label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="other">Other</option>
                  <option value="emergency">Emergency Fund</option>
                  <option value="vacation">Vacation</option>
                  <option value="car">Car</option>
                  <option value="home">Home</option>
                  <option value="education">Education</option>
                  <option value="investment">Investment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Deadline (Optional)</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold transition-all"
              >
                Create Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Progress Modal */}
      {showAddProgressModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1f2e] rounded-2xl max-w-md w-full shadow-2xl border border-gray-800/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add Progress</h3>
              <button
                onClick={() => {
                  setShowAddProgressModal(false);
                  setSelectedGoal(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-400 text-sm">Adding to: <span className="text-white font-semibold">{selectedGoal.name}</span></p>
              <p className="text-gray-500 text-xs">Current: ${selectedGoal.currentAmount.toFixed(0)} / ${selectedGoal.targetAmount.toFixed(0)}</p>
            </div>

            <form onSubmit={handleAddProgress} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Amount to Add ($)</label>
                <input
                  type="number"
                  value={addProgress}
                  onChange={(e) => setAddProgress(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="100"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold transition-all"
              >
                Add Progress
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
