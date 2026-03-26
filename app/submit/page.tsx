"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitPage() {
  const router = useRouter();

  const zones = [
    "Ahmedabad","Ajmer","Allahabad (Prayagraj)","Bangalore","Bhopal",
    "Bhubaneswar","Bilaspur","Chandigarh","Chennai","Gorakhpur",
    "Guwahati","Jammu","Kolkata","Malda","Mumbai","Muzaffarpur",
    "Patna","Ranchi","Secunderabad","Siliguri","Thiruvananthapuram"
  ];

  const [form, setForm] = useState({
    name: "",
    marks: "",
    zone: "Kolkata",
    category: "UR",
    shift: "1",
    exam: "RRB-2026",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [rank, setRank] = useState<any>(null);

const submit = async () => {
  if (loading) return;

  setError("");
  setSuccess("");

  if (!form.name || !form.marks) {
    setError("Please fill all fields");
    return;
  }

  const marks = Number(form.marks);
  if (marks < 0 || marks > 300) {
    setError("Marks must be between 0 and 300");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const json = await res.json();

    if (!res.ok || !json?.rank) {
      throw new Error("API failed");
    }

    setRank(json.rank);
    setSuccess("Submitted successfully 🚀");

  } catch (err) {
    console.error(err);
    setError("Something went wrong. Try again.");
  } finally {
    setLoading(false); // 🔥 THIS IS THE REAL FIX
  }
};

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm">

        <h1 className="text-2xl font-bold text-center">
          Know Your Rank 📊
        </h1>

        {error && (
          <p className="mt-4 text-red-500 text-center">{error}</p>
        )}

        {success && rank && (
          <div className="mt-4 p-4 bg-green-50 border border-green-400 rounded-lg text-center space-y-2">
            <p className="font-semibold text-green-700">{success}</p>

            <p className="text-lg font-bold">
              🎯 All India Rank: #{rank.overall}
            </p>

            <p className="text-lg font-bold text-green-700">
              🚀 Normalized Rank: #{rank.normalized}
            </p>

            <p className="text-sm">
              📍 Zone Rank: #{rank.zoneCategory}
            </p>

            <p className="text-sm">
              🔄 Shift Rank: #{rank.shiftZoneCategory}
            </p>

            <button
              onClick={() => router.push("/leaderboard")}
              className="mt-3 w-full py-2 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white rounded-lg"
            >
              View Leaderboard
            </button>
          </div>
        )}

        {!success && (
          <>
            <div className="mt-6 space-y-4">

              <input
                placeholder="Name"
                className="w-full border p-2 rounded-lg"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <select
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                className="w-full border p-2 rounded-lg"
              >
                {zones.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border p-2 rounded-lg"
              >
                <option>UR</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
                <option>EWS</option>
              </select>

              <select
                value={form.shift}
                onChange={(e) => setForm({ ...form, shift: e.target.value })}
                className="w-full border p-2 rounded-lg"
              >
                <option value="1">Shift 1</option>
                <option value="2">Shift 2</option>
                <option value="3">Shift 3</option>
              </select>

              <input
                type="number"
                placeholder="Marks"
                className="w-full border p-2 rounded-lg"
                value={form.marks}
                onChange={(e) => setForm({ ...form, marks: e.target.value })}
              />
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="w-full mt-6 py-2 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white rounded-lg"
            >
              {loading ? "Submitting..." : "Submit & Check Rank 🚀"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}