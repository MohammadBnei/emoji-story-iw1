"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
);

export default function Home() {
  useEffect(() => {
    socket.on("story-update", (data) => {
      console.log({ data });
    });
  });
  return <h1>Emoji Story IW1</h1>;
}
