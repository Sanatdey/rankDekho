"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminNormalizationPage() {
  const [oldStats, setOldStats] = useState<any>(null);
  const [newStats, setNewStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 fetch existing stats
  const fetchOldStats = async () => {
    try {
      const res = await fetch("/api/normalization-stats");
      const json = await res.json();
      setOldStats(json);
    } catch {
      setOldStats(null);
    }
  };

  const router = useRouter();
  useEffect(() => {
    const pass = prompt("Enter admin password");

    if (pass !== "Manik@001") {
      router.replace("/"); // 🔁 redirect to home
    }
  }, []);

  const handleRecalculate = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/recalculate-normalization", {
        method: "POST",
      });

      const json = await res.json();
      setNewStats(json.stats);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOldStats();
  }, []);

  const StatCard = ({ title, stats }: any) => {
    if (!stats) return null;

    return (
      <div className="bg-white rounded-xl shadow p-4 border">
        <h3 className="font-semibold mb-2">{title}</h3>

        <div className="text-sm space-y-1">
          <p>📊 Mean: <span className="font-medium">{stats.mean?.toFixed(2)}</span></p>
          <p>📉 SD: <span className="font-medium">{stats.sd?.toFixed(2)}</span></p>
          <p>👥 Count: <span className="font-medium">{stats.count}</span></p>
        </div>
      </div>
    );
  };

  const StatsBlock = ({ label, data }: any) => {
    if (!data) return null;

    return (
      <div className="mt-4">
        <h2 className="text-lg font-bold mb-3">{label}</h2>

        {/* Global */}
        <StatCard title="🌍 Global" stats={data.global} />

        {/* Shifts */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          <StatCard title="Shift 1" stats={data.shifts?.["1"]} />
          <StatCard title="Shift 2" stats={data.shifts?.["2"]} />
          <StatCard title="Shift 3" stats={data.shifts?.["3"]} />
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">

      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="bg-white p-5 rounded-xl shadow text-center">
          <h1 className="text-xl font-bold">
            📊 Normalization Stats (Admin)
          </h1>

          <button
            onClick={handleRecalculate}
            disabled={loading}
            className="mt-4 w-full py-3 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white rounded-lg font-semibold"
          >
            {loading ? "Calculating..." : "Recalculate Normalization"}
          </button>
        </div>

        {/* OLD STATS */}
        {oldStats && (
          <div className="mt-6">
            <StatsBlock label="📌 Current Stats" data={oldStats} />
          </div>
        )}

        {/* NEW STATS */}
        {newStats && (
          <div className="mt-6">
            <StatsBlock label="🆕 New Stats (After Recalculation)" data={newStats} />
          </div>
        )}

      </div>

    </main>
  );
}