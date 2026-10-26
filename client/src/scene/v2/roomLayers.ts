// Splits a room cutaway into layers that assemble in order, like the ship: floor and grid,
// then walls (with the floor number), then the room's objects in two passes, then people
// and moving bits. The slice beam keeps its own timing. Per-path draw delays from the
// mockup are dropped; each layer sets its timing through --ld.

const FLOOR = 18; // floor slab + grid lines, the first elements of every room shell
const SHELL = 24; // + back walls

export type RoomLayers = string[];

const isBeam = (el: string) => el.includes('class="cut"');
const isLife = (el: string) => el.startsWith("<g") || el.startsWith("<circle");
const stripDelay = (el: string) => el.replace(/ style="animation-delay:[^;"]*;animation-duration:[^;"]*;/, ' style="');

export function roomLayers(room: string, floorNumber: string): { layers: RoomLayers; beam: string } {
  const els = room.split("\n").map((l) => l.trim()).filter(Boolean);
  const beam = els.filter(isBeam).join("");
  const rest = els.filter((el) => !isBeam(el)).map(stripDelay);
  const floor = rest.slice(0, FLOOR);
  const walls = rest.slice(FLOOR, SHELL);
  const body = rest.slice(SHELL);
  const objects = body.filter((el) => !isLife(el));
  const life = body.filter(isLife);
  const half = Math.ceil(objects.length / 2);
  return {
    layers: [floor, [...walls, floorNumber], objects.slice(0, half), objects.slice(half), life].map((l) => l.join("")),
    beam,
  };
}
