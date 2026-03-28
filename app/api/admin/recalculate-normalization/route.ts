import { db } from "../../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

type Stats = {
  global: { mean: number; sd: number; count: number };
  shifts: Record<string, { mean: number; sd: number; count: number }>;
  updatedAt: Date;
};

export async function POST() {
  try {
    // 🔥 1. FETCH USERS
    const snapshot = await getDocs(collection(db, "scores"));

    const shifts: Record<string, number[]> = {};
    const all: number[] = [];
    const users: any[] = [];

    snapshot.docs.forEach((d) => {
      const data = d.data();

      if (data.marks != null && data.shift != null) {
        const shiftKey = String(data.shift);

        if (!shifts[shiftKey]) shifts[shiftKey] = [];
        shifts[shiftKey].push(data.marks);

        all.push(data.marks);

        users.push({
          id: d.id,
          ...data,
        });
      }
    });

    // 🔥 2. CALC FUNCTION
    const calc = (arr: number[]) => {
      const n = arr.length;
      if (n === 0) return { mean: 0, sd: 0, count: 0 };

      const mean = arr.reduce((a, b) => a + b, 0) / n;

      const variance =
        arr.reduce((sum, x) => sum + (x - mean) ** 2, 0) / n;

      const sd = Math.sqrt(variance);

      return { mean, sd, count: n };
    };

    // 🔥 3. BUILD STATS
    const shiftStats: Record<string, any> = {};

    Object.keys(shifts).forEach((key) => {
      shiftStats[key] = calc(shifts[key]);
    });

    const stats: Stats = {
      global: calc(all),
      shifts: shiftStats,
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "normalization", "latest"), stats);

    // 🔥 4. NORMALIZE
    const normalize = (marks: number, shift: string) => {
      const shiftStats = stats.shifts[shift];
      const global = stats.global;

      if (!shiftStats || !global || shiftStats.sd === 0 || global.sd === 0) {
        return marks;
      }

      return (
        ((marks - shiftStats.mean) / shiftStats.sd) *
          global.sd +
        global.mean
      );
    };

    const enriched = users.map((u) => ({
      ...u,
      normalized: normalize(u.marks, String(u.shift)),
    }));

    // 🔥 5. GLOBAL RANK
    const sortedGlobal = [...enriched].sort(
      (a, b) => b.normalized - a.normalized
    );

    sortedGlobal.forEach((u, i) => {
      u.normalizedRank = i + 1;
    });

    // 🔥 6. ZONE + CATEGORY RANK
    const groupMap: Record<string, any[]> = {};

    enriched.forEach((u) => {
      const zone = u.zone || "UNKNOWN";
      const category = u.category || "UNKNOWN";

      const key = `${zone}_${category}`;

      if (!groupMap[key]) groupMap[key] = [];
      groupMap[key].push(u);
    });

    Object.values(groupMap).forEach((group) => {
      group.sort((a, b) => b.normalized - a.normalized);

      group.forEach((u, i) => {
        u.zoneCategoryRank = i + 1;
      });
    });

    // 🔥 7. FETCH VACANCY
    const vacancySnap = await getDoc(
      doc(db, "vacancies", "rrb_cen_03_2025")
    );

    const vacancyData = vacancySnap.data();

    // 🔥 8. COMPUTE SAFE ZONE
    enriched.forEach((u) => {
      const zone = u.zone;
      const category = u.category;

      const zoneData = vacancyData?.zones?.[zone];
      const catVacancy = zoneData?.[category];

      if (!catVacancy) {
        u.isSafe = false;
        return;
      }

      u.isSafe = u.zoneCategoryRank <= catVacancy;
    });

    // 🔥 9. SAVE EVERYTHING
    const updates = enriched.map((u) =>
      setDoc(
        doc(db, "scores", u.id),
        {
          normalized: Number(u.normalized.toFixed(2)),
          normalizedRank: u.normalizedRank,
          zoneCategoryRank: u.zoneCategoryRank,
          isSafe: u.isSafe,
        },
        { merge: true }
      )
    );

    await Promise.all(updates);

    return Response.json({
      success: true,
      updated: enriched.length,
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}