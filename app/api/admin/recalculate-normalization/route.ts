import { db } from "../../../lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

export async function POST() {
  try {
    const snapshot = await getDocs(collection(db, "scores"));

    const shifts: any = { 1: [], 2: [], 3: [] };
    const all: number[] = [];

    snapshot.docs.forEach((d) => {
      const data = d.data();

      if (data.marks != null && data.shift != null) {
        shifts[data.shift]?.push(data.marks);
        all.push(data.marks);
      }
    });

    const calc = (arr: number[]) => {
      const n = arr.length;
      if (n === 0) return { mean: 0, sd: 0, count: 0 };

      const mean = arr.reduce((a, b) => a + b, 0) / n;

      const variance =
        arr.reduce((sum, x) => sum + (x - mean) ** 2, 0) / n;

      const sd = Math.sqrt(variance);

      return { mean, sd, count: n };
    };

    const stats = {
      global: calc(all),
      shifts: {
        "1": calc(shifts[1]),
        "2": calc(shifts[2]),
        "3": calc(shifts[3]),
      },
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "normalization", "latest"), stats);

    return Response.json({ success: true, stats });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}