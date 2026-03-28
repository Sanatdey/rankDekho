"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

interface Entry {
  id: string;
  name: string;
  marks: number;
  zone: string;
  category: string;
  shift: string;
  exam?: string;
  normalizedMarks?: number;
  createdAt?: any;
};

export default function CleanupPage() {
  const [data, setData] = useState<Entry[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const pass = prompt("Enter admin password");

    if (pass !== "Manik@001") {
      router.replace("/"); // 🔁 redirect to home
    }
  }, []);
  // 🔥 Fetch all data
  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "scores"));

    const list = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    list.sort((a, b) => {
      const keyA = `${a.name}_${a.zone}_${a.exam}_${a.shift}_${a.marks}`;
      const keyB = `${b.name}_${b.zone}_${b.exam}_${b.shift}_${b.marks}`;

      if (keyA === keyB) {
        // sort duplicates by marks (highest first)
        return b.marks - a.marks;
      }

      return keyA.localeCompare(keyB);
    });

    setData(list);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 Toggle checkbox
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // 🔥 Select all duplicates (auto detect)
  const selectDuplicates = () => {
    const map = new Map<string, string[]>();

    data.forEach((item) => {
      const key = `${item.name}_${item.zone}_${item.exam}_${item.shift}_${item.marks}`;

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item.id);
    });

    const dupIds: string[] = [];

    map.forEach((ids) => {
      if (ids.length > 1) {
        // keep first, mark rest
        dupIds.push(...ids.slice(1));
      }
    });

    setSelected(new Set(dupIds));
  };
  const handleBackup = () => {
      if (!data.length) return;

      // headers
      const headers = [
        "id",
        "name",
        "marks",
        "zone",
        "category",
        "shift",
        "exam",
        "normalized",
        "normalizedRank",
        "zoneCategoryRank",
        "createdAt",
      ];

      const rows = data.map((item) => [
        item.id,
        item.name,
        item.marks,
        item.zone,
        item.category,
        item.shift,
        item.exam || "",
        (item as any).normalized || "",
        (item as any).normalizedRank || "",
        (item as any).zoneCategoryRank || "",
        item.createdAt?.toDate?.().toISOString?.() || "",
      ]);

      const csvContent =
        [headers, ...rows]
          .map((row) =>
            row
              .map((val) =>
                `"${String(val ?? "").replace(/"/g, '""')}"`
              )
              .join(",")
          )
          .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `scores-backup-${Date.now()}.csv`;
      link.click();

      URL.revokeObjectURL(url);
    };

  // 🔥 Bulk delete
  const handleDelete = async () => {
    if (selected.size === 0) return;

    if (!confirm(`Delete ${selected.size} selected entries?`)) return;

    setLoading(true);

    for (const id of selected) {
      await deleteDoc(doc(db, "scores", id));
    }

    alert("Deleted successfully");

    setSelected(new Set());
    await fetchData();

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">

      <div className="max-w-5xl mx-auto bg-white p-4 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-4 text-center">
          🔍 Duplicate Manager
        </h1>

        {/* ACTIONS */}
        <div className="flex gap-2 mb-4 flex-wrap">

          <button
            onClick={selectDuplicates}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Auto Select Duplicates
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Deleting..." : `Delete Selected (${selected.size})`}
          </button>

          <button
            onClick={handleBackup}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            📥 Backup Data (CSV)
          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">✔</th>
                <th>Name</th>
                <th>Category</th>
                <th>Zone</th>
                <th>Shift</th>
                <th>Marks</th>
                <th>ID</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>

                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.zone}</td>
                  <td>{item.shift}</td>
                  <td>{item.marks}</td>
                  <td className="text-xs">{item.id}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>

    </main>
  );
}