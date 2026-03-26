import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* 🔥 HERO */}
      <section className="text-center py-12 px-4 bg-white shadow-sm">
        <h1 className="text-3xl font-bold">
          Check Your Rank Before Result 🚀
        </h1>

        <p className="mt-3 text-gray-600">
          Compare your marks with real students & see where you stand.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link href="/submit">
            <button className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-amber-700 hover:via-orange-600 hover:to-red-700 transition shadow-md">
              Submit Marks
            </button>
          </Link>

          <Link href="/leaderboard">
            <button className="border-2 border-amber-600 text-amber-700 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition">
              View Leaderboard
            </button>
          </Link>
        </div>

        {/* 🎥 Soft Video Push */}
        <p className="text-xs text-gray-500 mt-4">
          🎥 Full cutoff analysis →
          <a
            href="https://www.youtube.com/watch?v=ShobN8puCuA"
            target="_blank"
            className="underline ml-1"
          >
            Watch Now
          </a>
        </p>
      </section>

      {/* 📊 VACANCY */}
      <section className="py-10 px-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Latest Vacancy Overview 📢
        </h2>

        <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
          <p><b>Exam:</b> RRB Nursing Superindant 2026</p>
          <p><b>Total Posts:</b>  272</p>
          <p><b>Expected Cutoff:</b> 60–75</p>
          <p><b>Competition Level:</b> High 🔥</p>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          *Independent analysis based on student data
        </p>

        {/* 🔥 STRONG VIDEO PUSH */}
        <div className="mt-5 text-center">
          <p className="mt-2 text-sm">
          ℹ️{" "}
          <Link href="/normalization-info" className="text-blue-600 underline">
            How your marks will change after normalization
          </Link>
        </p>
          <p className="text-sm text-gray-600">
            📊 Want detailed cutoff & selection analysis?
          </p>
          <a
            href="https://www.youtube.com/channel/UCRy0SOk3XQCa0L0TFDuzIwQ"
            target="_blank"
            className="inline-block mt-2 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:via-orange-600 hover:to-red-700 transition font-semibold"
          >
            Check Cutoff Analysis 📊
          </a>
        </div>
      </section>

      {/* 💡 WHY SECTION */}
      <section className="py-10 px-4 bg-white">
        <h2 className="text-xl font-semibold text-center mb-6">
          Why RankDekho?
        </h2>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">

          <div className="p-4 border rounded-xl">
            <h3 className="font-semibold">📊 Real Data</h3>
            <p className="text-sm text-gray-600">
              Based on actual student submissions
            </p>
          </div>

          <div className="p-4 border rounded-xl">
            <h3 className="font-semibold">⚡ Instant Rank</h3>
            <p className="text-sm text-gray-600">
              See your position immediately
            </p>
          </div>

          <div className="p-4 border rounded-xl">
            <h3 className="font-semibold">🎯 Zone Wise</h3>
            <p className="text-sm text-gray-600">
              Compare within your zone & category
            </p>
          </div>

        </div>
      </section>

      {/* 🚀 FINAL CTA */}
      <section className="text-center py-10 px-4">
        <h2 className="text-2xl font-bold">
          Ready to know your rank?
        </h2>

        <p className="text-gray-600 mt-2">
          Join students already checking their position
        </p>

        <Link href="/submit">
          <button className="mt-5 bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-amber-700 hover:via-orange-600 hover:to-red-700 transition font-semibold">
            Check Now 🔥
          </button>
        </Link>
      </section>

      {/* 📺 FOOTER (CHANNEL LINK) */}
      <footer className="text-center text-xs text-gray-500 py-6">
        Built for RRB / NORCET aspirants 🚆 <br />

        <a
          href="https://www.youtube.com/channel/UCRy0SOk3XQCa0L0TFDuzIwQ"
          target="_blank"
          className="underline"
        >
          Subscribe on YouTube @VidyaDeepam
        </a>
      </footer>

    </main>
  );
}