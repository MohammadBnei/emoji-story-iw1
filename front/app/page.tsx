"use client";

import Step from "@/component/step";
import {
  ClientToServerEvent,
  ServerToClientEvent,
  Story,
  StoryStep,
} from "@/interface/event";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

const socket: Socket<ServerToClientEvent, ClientToServerEvent> = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
);

export default function Home() {
  const [story, setStory] = useState<Story | null>(null);
  useEffect(() => {
    socket.on("story-update", (data) => {
      console.log(data);
      setStory(data);
    });
  }, []);

  const step1 = story?.steps?.[0] as StoryStep;
  console.log({ step1 });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl">Emoji Story IW1</h1>
      {step1 && (
        <Step step={step1} onVote={(data) => socket.emit("step-vote", data)} />
      )}
    </main>
  );
}
