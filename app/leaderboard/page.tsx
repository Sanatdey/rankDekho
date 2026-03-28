"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "../utils/gtag";

interface LeaderboardEntry {
  id: string;
  name: string;
  marks: number;
  shift?: string;

  normalized?: number;
  normalizedRank?: number;
  zoneCategoryRank?: number;
  isSafe?: boolean;
}

export default function Leaderboard() {
  const [zone, setZone] = useState("");
  const [category, setCategory] = useState("");

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [searchResults, setSearchResults] = useState<LeaderboardEntry[]>([]);

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [lastId, setLastId] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalUsers: 0, highestMarks: 0 });
  const [timeLeft, setTimeLeft] = useState(0);

  const LIMIT = 30;

  const zones = [
    "Ahmedabad","Ajmer","Allahabad (Prayagraj)","Bangalore","Bhopal",
    "Bhubaneswar","Bilaspur","Chandigarh","Chennai","Gorakhpur",
    "Guwahati","Jammu","Kolkata","Malda","Mumbai","Muzaffarpur",
    "Patna","Ranchi","Secunderabad","Siliguri","Thiruvananthapuram"
  ];

  const fetchStats = async () => {
    const res = await fetch("/api/stats");
    const json = await res.json();
    setStats(json);
  };

  const fetchData = async (loadMore = false) => {
    setLoading(true);

    if (!loadMore) {
      setData([]);
      setLastId(null);
    }

    const params = new URLSearchParams();
    if (zone) params.append("zone", zone);
    if (category) params.append("category", category);
    if (loadMore && lastId) params.append("lastId", lastId);

    const res = await fetch(`/api/leaderboard?${params}`);
    const json = await res.json();

    setData((prev) => loadMore ? [...prev, ...json.data] : json.data);
    setLastId(json.lastId);

    setLoading(false);
  };

  const handleSearch = async () => {
    if (!input.trim()) return;

    setSearch(input);
    setSearchLoading(true);

    const res = await fetch(`/api/search-normalized?name=${input}`);
    const json = await res.json();

    setSearchResults(json);
    setSearchLoading(false);
  };

  const clearSearch = () => {
    setSearch("");
    setInput("");
    setSearchResults([]);
  };

  useEffect(() => {
    fetchStats();
    fetchData();
  }, [zone, category]);

  useEffect(() => {
    trackEvent("leaderboard_viewed");
  }, []);

  useEffect(() => {
  const interval = setInterval(() => {
    const now = Date.now();

    const minutes15 = 15 * 60 * 1000;
    const nextTick = Math.ceil(now / minutes15) * minutes15;

    const diff = Math.max(0, nextTick - now);

    setTimeLeft(diff);
  }, 1000);

  return () => clearInterval(interval);
}, []);

  const rawData: LeaderboardEntry[] = search
  ? searchResults || []
  : data || [];

  const finalData = [...rawData].sort((a, b) => {
    // 🎯 If BOTH selected → use category rank
    if (zone && category) {
      return (a.zoneCategoryRank || 999999) - (b.zoneCategoryRank || 999999);
    }

    // 🌍 Otherwise ALWAYS use All India Rank
    return (a.normalizedRank || 999999) - (b.normalizedRank || 999999);
  });

  const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">

      {/* HEADER */}

        <div className="max-w-2xl mx-auto mt-3 text-center">
            <h1 className="text-3xl text-center font-bold">
            RRB Nursing Superintendent 2026
          </h1>
        </div>

      <div className="max-w-2xl mx-auto mt-3 flex items-center justify-between bg-white border rounded-xl px-4 py-3 text-xs shadow-sm">
        <span className="text-gray-600">
          🔥 <b>{stats.totalUsers}+</b> students ranked
        </span>

        <span className="text-gray-300">|</span>

        <span className="text-orange-600 font-semibold">
          ⚡ Update in {formatTime(timeLeft)}
        </span>

        <span className="text-gray-300">|</span>

        <span className="text-green-700 font-semibold">
          🏆 {stats.highestMarks}
        </span>
      </div>

      {/* SEARCH */}
      <div className="max-w-2xl mx-auto mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your name..."
          className="w-full border p-2 rounded-lg"
        />

        <button
          onClick={handleSearch}
          className="px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg"
        >
          Search
        </button>

        {search && (
          <button onClick={clearSearch} className="px-3 border rounded-lg">
            ✕
          </button>
        )}
      </div>

      {/* SEARCH CARD */}
      {search && searchResults[0] && (() => {
        const u = searchResults[0];

        const isSafe = u.isSafe;
        const isBorderline = u.zoneCategoryRank! <= 5;

        let message = "";
        let color = "";
        let bg = "";

        if (isSafe) {
          message = "🎉 You're on track for selection";
          color = "text-green-700";
          bg = "bg-green-50 border-green-300";
        } else if (isBorderline) {
          message = "🟡 Very close — wait for final cutoff";
          color = "text-yellow-700";
          bg = "bg-yellow-50 border-yellow-300";
        } else {
          message = "💪 Come back stronger";
          color = "text-gray-700";
          bg = "bg-gray-50 border-gray-300";
        }

        return (
          <div className={`max-w-2xl mx-auto mt-5 p-5 rounded-2xl border shadow-md ${bg}`}>

            <p className="text-xl font-bold text-center">
              🎯 {u.name}
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4 text-center">

              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs">🌍 AIR</p>
                <p className="font-bold">#{u.normalizedRank}</p>
              </div>

              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs">🎯 Zone Rank</p>
                <p className="font-bold">#{u.zoneCategoryRank}</p>
              </div>

              <div className="bg-white p-3 rounded-lg">
                <p className="text-xs">📊 Norm</p>
                <p className="font-bold text-green-700">
                  {Number(u.normalized).toFixed(2)}
                </p>
              </div>

            </div>

            <p className={`mt-4 text-center font-semibold ${color}`}>
              {message}
            </p>

          </div>
        );
      })()}

      {/* FILTERS */}
      {!search && (
        <div className="max-w-2xl mx-auto mt-3 flex gap-2">
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            <option value="">All Zones</option>
            {zones.map((z) => <option key={z}>{z}</option>)}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            <option value="">All Categories</option>
            <option>UR</option>
            <option>OBC</option>
            <option>SC</option>
            <option>ST</option>
            <option>EWS</option>
          </select>
        </div>
      )}

      {/* CONTEXT TEXT */}
      <p className="text-center text-xs text-gray-600 mt-2">
        {!zone && !category && "🌍 Showing All India Rank"}
        {zone && !category && "📍 Zone selected — still All India Rank"}
        {zone && category && "🎯 Showing actual selection rank"}
      </p>

      {/* LEGEND */}
      <p className="text-center text-xs text-gray-500 mt-2">
        🟢 Safe | 🟡 Borderline | 🔴 Risk
      </p>

      {/* LIST */}
      <div className="max-w-2xl mx-auto mt-4">
        {finalData.map((item, index) => {

          const isSafe = item.isSafe;
          const isBorderline = item.zoneCategoryRank! <= 5;

          return (
            <div
              key={item.id}
              className={`p-4 mb-3 rounded-xl border shadow-sm

                ${isSafe ? "bg-green-50 border-green-200" : ""}
                ${!isSafe && isBorderline ? "bg-yellow-50 border-yellow-300" : ""}
                ${!isSafe && !isBorderline ? "bg-white border-gray-200" : ""}
              `}
            >
              <div className="grid grid-cols-5 items-center">

                <div className="font-bold">
                  {zone && category
                    ? `#${item.zoneCategoryRank}`
                    : `#${item.normalizedRank}`}
                </div>

                <div className="font-semibold">{item.name}</div>
                <div>{item.marks}</div>
                <div>S{item.shift}</div>

                <div className={`font-semibold
                  ${isSafe ? "text-green-700" : ""}
                  ${!isSafe && isBorderline ? "text-yellow-700" : ""}
                  ${!isSafe && !isBorderline ? "text-red-600" : ""}
                `}>
                  {Number(item.normalized).toFixed(2)}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </main>
  );
}