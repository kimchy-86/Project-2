'use client';

import { useState, useEffect } from 'react';

interface Habit {
  id: string;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchHabits = async () => {
    const response = await fetch('/api/habits');
    const data = await response.json();
    setHabits(data);
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });
      if (response.ok) {
        setTitle('');
        await fetchHabits();
      }
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await fetch(`/api/habits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      await fetchHabits();
    } catch (error) {
      // Error handling
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="grid grid-cols-[300px_1fr] gap-0">
        <aside className="sticky top-0 h-screen bg-white border-r border-zinc-200 p-6">
          <h1 className="text-2xl font-semibold mb-6 text-zinc-900">
            Mini Habit Tracker
          </h1>
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter habit title"
              className="w-full p-3 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="w-full p-3 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Habit'}
            </button>
          </form>
        </aside>
        <main className="p-6">
          <div className="space-y-2">
            {habits.length === 0 ? (
              <div className="text-center text-zinc-500 py-12">
                No habits yet. Create one to get started.
              </div>
            ) : (
              habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 p-6 rounded-lg border border-zinc-200 bg-white"
                >
                  <input
                    type="checkbox"
                    checked={habit.completed}
                    onChange={() => handleToggle(habit.id, habit.completed)}
                    className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-500"
                  />
                  <span
                    className={`flex-1 ${
                      habit.completed
                        ? 'line-through text-zinc-500'
                        : 'text-zinc-900'
                    }`}
                  >
                    {habit.title}
                  </span>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
