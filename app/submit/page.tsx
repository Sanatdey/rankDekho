"use client";
import { trackEvent } from "../utils/gtag";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        body: JSON.stringify(form),
      });

      console.log(res);

      const json = await res.json();
      if (!res.ok) throw new Error();

      setRank(json.rank);

            // 🔥 ADD THIS EXACTLY HERE
      trackEvent("result_viewed", {
        rank: json.rank.overall,
        percentile: json.rank.percentile,
      });
      setSuccess("Submitted successfully 🚀");
      setLoading(false);

      setForm({
        name: "",
        marks: "",
        zone: "Kolkata",
        category: "UR",
        shift: "1",
        exam: "RRB-2026",
      });

    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm">

        <h1 className="text-2xl font-bold text-center">
          Know Your Rank 📊
        </h1>

        {error && (
          <p className="mt-4 text-red-500 text-center">{error}</p>
        )}

      {rank && (
        <div className="mt-6 space-y-4">

          {/* 🔥 Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              🔥 Your RRB Rank is LIVE!
            </h2>

            <p className="text-sm text-red-500 mt-1">
              🎯 {rank.totalUsers}+ students submitted • Data updating
            </p>
          </div>

          {/* 🧠 Main Card */}
          <div className="bg-white rounded-xl p-5 shadow-md border space-y-3 text-center">

            {/* 🔥 Percentile */}
            <div className="bg-green-100 text-green-800 py-2 rounded-lg font-semibold">
              🔥 You’re ahead of {rank.percentile} <b>%</b> students
            </div>

            <p className="text-xl font-bold">
              🚀 All India Rank: #{rank.overall}
            </p>

            <p className="text-lg text-green-600 font-semibold">
              ⚡ Normalized Rank: #{rank.normalized}
            </p>

            <p className="text-sm">
              📍 Zone Rank: #{rank.zoneCategory}
            </p>

            <p className="text-sm">
              🔄 Shift Rank: #{rank.shiftZoneCategory}
            </p>

            {/* 🏆 Highest */}
            <p className="text-sm font-medium">
              🏆 Highest mark: {rank.highestMarks}
            </p>

            {/* ⚠️ Urgency */}
            <div className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded-lg">
              ⚠️ Your rank can still change by 50–150 positions
            </div>

            {/* 📢 Share */}
            <button
              onClick={() => {
                trackEvent("share_clicked", {
                  rank: rank.overall,
                  percentile: rank.percentile,
                });

                const text = 
`🔥 I got Rank #${rank.overall} in RRB

🔥 Beat ${rank.percentile}% students

Check yours 👉 ${window.location.origin}

Don't trust fake predictions ⚡`;

                if (navigator.share) {
                  navigator.share({ text }).then(() => {
                    trackEvent("share_completed", {
                      rank: rank.overall,
                    });
                  });
                } else {
                  navigator.clipboard.writeText(text);
                  alert("Copied!");

                  // fallback tracking
                  trackEvent("share_completed", {
                    rank: rank.overall,
                  });
                }
              }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold"
            >
              🟢 Show My Rank to Friends
            </button>
              <p>⚡ 100+ students already shared their rank</p>
            {/* 📺 YouTube CTA */}
            <a
              href="https://www.youtube.com/@VidyaDeepamOfficial?sub_confirmation=1"
              target="_blank"
              onClick={() =>
                trackEvent("youtube_clicked", {
                  rank: rank.overall,
                  percentile: rank.percentile,
                })
              }
              className="block w-full py-3 rounded-lg border text-red-600 font-semibold bg-red-50 hover:bg-red-100 transition"
            >
              📺 Don’t Miss Your Final Rank Update ⚡
            </a>
            <p className="mt-2 text-sm text-gray-600">👥 100+ students tracking updates right now</p>
            <p className="mt-2 text-sm text-gray-600">
              📊 Based on real data — no <b>guesswork</b>
            </p>

          </div>

          {/* 🔁 Retention */}
          <div className="bg-green-50 p-4 rounded-xl text-center border space-y-2">
            <p className="font-semibold">
              ⚡ Ranks updating rapidly
            </p>

            <p className="text-sm text-gray-600">
              ⏳ Come back in 3–6 hours for updated rank
            </p>


            <Link
              href="/leaderboard"
              onClick={() => trackEvent("leaderboard_clicked_result", {})}
              className="block w-full py-2 bg-green-600 text-white rounded-lg text-center font-semibold"
            >
              📊 View Leaderboard
            </Link>
          </div>

          {/* 🔥 Incoming Loop */}
          <div className="bg-green-100 p-4 rounded-xl text-center border">
            <p className="font-semibold">
              ⚡ Ranks will update again soon!
            </p>

            <p className="text-lg font-bold mt-1">
              🏆 {rank.totalUsers} → {rank.totalUsers + 50}+ students incoming...
            </p>

            <p className="text-sm text-gray-600 mt-1">
              Come back in a few hours to check your updated rank
            </p>
          </div>

          {/* 💬 Feedback */}
          <div className="bg-white p-4 rounded-xl border space-y-2">
            <p className="font-semibold text-center">
              💬 Help improve your rank accuracy 
            </p>

            <div className="flex gap-2 flex-wrap justify-center">
              <button className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                Wrong Rank
              </button>
              <button className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                Bug
              </button>
              <button className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                Feature
              </button>
            </div>
          </div>

        </div>
      )}

        {!rank && (
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
              onClick={() => {
                trackEvent("submit_clicked", {
                  location: "submit_page",
                });
                submit();
              }}
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