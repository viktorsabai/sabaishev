import { useState } from "react";
import Intro, { shouldShowIntro } from "@/scene/Intro";
import MainScene from "@/scene/v2/MainScene";

// Redesign: the whole site is one scene inside the ship. On a first visit a short intro plays
// and the scene mounts as it fades, so the ship assembles in view rather than under the intro.
export default function Home() {
  const [intro] = useState(shouldShowIntro);
  const [ready, setReady] = useState(!intro);
  return (
    <>
      {ready && <MainScene />}
      {intro && <Intro onReveal={() => setReady(true)} />}
    </>
  );
}
