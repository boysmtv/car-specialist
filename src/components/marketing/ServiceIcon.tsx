import { Snowflake, Wrench, Lock, DoorOpen, Speaker, House, Zap, Sparkles, Droplets, Car } from "lucide-react";

export const SERVICE_ICONS = [
  { value: "snowflake", label: "AC", node: <Snowflake size={22} /> },
  { value: "wrench", label: "Perkakas", node: <Wrench size={22} /> },
  { value: "lock", label: "Kunci", node: <Lock size={22} /> },
  { value: "door", label: "Pintu", node: <DoorOpen size={22} /> },
  { value: "speaker", label: "Audio", node: <Speaker size={22} /> },
  { value: "house", label: "Rumah", node: <House size={22} /> },
  { value: "zap", label: "Elektrik", node: <Zap size={22} /> },
  { value: "sparkles", label: "Variasi", node: <Sparkles size={22} /> },
  { value: "droplets", label: "Cairan", node: <Droplets size={22} /> },
  { value: "car", label: "Mobil", node: <Car size={22} /> },
];

const BY_VALUE: Record<string, React.ReactNode> = Object.fromEntries(
  SERVICE_ICONS.map((i) => [i.value, i.node]),
);

const BY_SLUG: Record<string, string> = {
  "service-ac-mobil": "snowflake",
  "perbaikan-power-window": "car",
  "perbaikan-central-lock": "lock",
  "power-door": "door",
  "audio-mobil": "speaker",
  "home-service": "house",
  "variasi-mobil": "sparkles",
};

export function serviceIconNode(icon?: string | null, slug?: string): React.ReactNode {
  if (icon && BY_VALUE[icon]) return BY_VALUE[icon];
  if (slug && BY_SLUG[slug]) return BY_VALUE[BY_SLUG[slug]];
  return BY_VALUE.wrench;
}
