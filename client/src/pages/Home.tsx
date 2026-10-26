import MainScene from "@/scene/v2/MainScene";

// Redesign (CHANGES-2): the whole site is one scene inside the ship. Cases, experience and the
// brief are still being redesigned; until then they link to the previous site at /legacy.
export default function Home() {
  return <MainScene />;
}
