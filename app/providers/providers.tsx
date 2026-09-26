"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store"; // التأكد من مسار الـ store عندك[cite: 2]

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}