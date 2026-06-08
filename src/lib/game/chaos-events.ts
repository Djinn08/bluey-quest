export interface ChaosEvent {
  id: string;
  message: string;
  bonus: number;
}

export const CHAOS_EVENTS: ChaosEvent[] = [
  { id: "approved", message: "Muffin approved this decision.", bonus: 5 },
  { id: "spare", message: "Muffin found spare Dollarbucks.", bonus: 10 },
  { id: "inspected", message: "Muffin inspected your quest log.", bonus: 3 },
];

export const CHAOS_CHANCE = 0.05;

export function rollChaosEvent(): ChaosEvent | null {
  if (Math.random() >= CHAOS_CHANCE) return null;
  return CHAOS_EVENTS[Math.floor(Math.random() * CHAOS_EVENTS.length)];
}
