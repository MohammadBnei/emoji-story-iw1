"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
);

export default function Home() {
  const [story, setStory] = useState(null);
  useEffect(() => {
    socket.on("story-update", (data) => {
      setStory(data);
    });
  }, []);

  const step1 = story?.steps?.[0];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl">Emoji Story IW1</h1>
      {Object.entries(step1?.emojiCandidate || {}).map(([emoji, vote]) => (
        <div className="text-2xl border" key={emoji}>
          <button
            className="btn"
            onClick={() => socket.emit("step-vote", { emoji, stepOrder: 1 })}
          >
            {emoji}
          </button>{" "}
          - {vote}
        </div>
      ))}
    </main>
  );
}
