import ShipScene from "@/scene/ShipScene";

// Redesign: the whole site is one scene. Further rooms (cases, process, brief) land here step by step;
// the previous site stays at /legacy until the redesign covers it.
export default function Home() {
  return <ShipScene />;
}
