"use client";

import { useEffect, useState } from "react";

export default function NormalizationInfoPage() {
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/normalization-stats");
      const json = await res.json();
      setStats(json);
    } catch {
      setStats(null);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center">
          📊 RRB / NORCET Normalization Explained
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Understand how your marks are adjusted across different shifts
        </p>

        {/* SECTION 1 */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            🔍 Why Normalization is Needed?
          </h2>

          <p className="text-gray-700">
            In exams like RRB and NORCET, multiple shifts are conducted.
            Each shift may have a slightly different difficulty level.
          </p>

          <p className="mt-2 text-gray-700">
            So, to ensure fairness, marks are adjusted using a statistical method
            called <strong>Normalization</strong>.
          </p>
        </section>

        {/* SECTION 2 */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            ⚙️ How Our Normalization Works
          </h2>

          <p className="text-gray-700">
            We use a <strong>Z-score based model</strong> to estimate normalized marks.
          </p>

          <div className="bg-gray-100 p-4 rounded-lg mt-3 text-center font-mono">
            (Raw Marks - Shift Mean) / Shift SD × Global SD + Global Mean
          </div>
        </section>

        {/* SECTION 3 */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            ⚠️ Important Disclaimer
          </h2>

          <p className="text-gray-700">
            This is <strong>NOT official normalization</strong>.
          </p>

          <p className="mt-2 text-gray-700">
            It is an <strong>independent statistical estimate</strong> based on
            real student data.
          </p>
        </section>

        {/* 🔥 LIVE STATS */}
        {stats && (
          <section className="mt-8 border-t pt-6">

            <h2 className="text-xl font-semibold mb-4 text-center">
              📊 Current Dataset Stats (Live)
            </h2>

            {/* GLOBAL */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="font-semibold">🌍 Global</p>
              <p className="text-sm mt-2">
                Mean: <span className="font-medium">{stats.global.mean.toFixed(2)}</span>
              </p>
              <p className="text-sm">
                SD: <span className="font-medium">{stats.global.sd.toFixed(2)}</span>
              </p>
              <p className="text-sm">
                Students: <span className="font-medium">{stats.global.count}</span>
              </p>
            </div>

            {/* SHIFTS */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">

              {["1", "2", "3"].map((s) => (
                <div key={s} className="bg-white border rounded-lg p-3 shadow-sm">
                  <p className="font-semibold">Shift {s}</p>
                  <p className="text-sm mt-1">
                    Mean: {stats.shifts[s].mean.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    SD: {stats.shifts[s].sd.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    Count: {stats.shifts[s].count}
                  </p>
                </div>
              ))}

            </div>

            <p className="text-xs text-gray-500 text-center mt-3">
              ⚡ Updated dynamically based on student submissions
            </p>

          </section>
        )}

        {/* CTA */}
        <div className="mt-8 text-center border-t pt-6">
          <p className="text-gray-500 text-sm">🎯 Rank mil gaya?</p>

          <h3 className="text-lg font-semibold mt-1">
            Selection hoga ya nahi? 🤔
          </h3>

          <a
            href="https://www.youtube.com/@VidyaDeepamOfficial"
            target="_blank"
            className="inline-block mt-4 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            📊 Full Analysis on YouTube
          </a>
        </div>

      </div>

    </main>
  );
}