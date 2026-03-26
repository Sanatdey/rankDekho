import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET() {
  try {
    const snap = await getDoc(doc(db, "normalization", "latest"));

    if (!snap.exists()) {
      return Response.json({ error: "No normalization stats found" }, { status: 404 });
    }

    return Response.json(snap.data());

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}