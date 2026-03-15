// Habit frequency types
export type FrequencyType = "daily" | "specific_days" | "custom";

// Valid days of week
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

// Valid time of day
export type TimeOfDay = "morning" | "afternoon" | "evening" | "anytime";

// Preset colors
export const PRESET_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Purple
  "#85C1E2", // Sky Blue
  "#F8B88B", // Peach
  "#82E0AA", // Light Green
  "#FADBD8", // Light Pink
  "#F5B7B1", // Light Red
] as const;

// Built-in icons
export const BUILT_IN_ICONS = [
  "fitness",
  "food",
  "work",
  "health",
  "reading",
  "meditation",
  "water",
  "sleep",
  "study",
  "music",
  "art",
  "sports",
  "gaming",
  "coding",
  "cooking",
  "gardening",
  "cleaning",
  "writing",
  "yoga",
  "running",
  "cycling",
  "swimming",
  "dancing",
  "singing",
  "drawing",
  "photography",
  "travel",
  "learning",
  "networking",
  "journaling",
  "podcast",
  "movie",
  "book",
  "podcast_listening",
  "movie_watching",
  "hobby",
  "language_learning",
  "instrument_playing",
  "volunteering",
  "socializing",
  "mental_health",
  "nutrition",
  "exercise",
  "stretching",
  "walking",
  "hiking",
  "team_sport",
  "personal_project",
  "skill_development",
  "self_care",
] as const;

// Create Habit Request DTO
export interface CreateHabitDTO {
  // Required fields
  name: string; // max 50 characters
  icon: string; // from BUILT_IN_ICONS
  color: string; // from PRESET_COLORS
  frequencyType: FrequencyType;

  // Conditional fields based on frequencyType
  daysOfWeek?: DayOfWeek[]; // required if frequencyType === 'specific_days'
  customFrequency?: number; // required if frequencyType === 'custom' (X times per week)

  // Optional fields
  goal?: string;
  timeOfDay?: TimeOfDay;
  notes?: string; // max 200 characters
  startDate?: Date;
}

// Habit Response
export interface HabitResponse {
  id: number;
  userId: number;
  name: string;
  icon: string;
  color: string;
  frequencyType: FrequencyType;
  daysOfWeek: DayOfWeek[] | null;
  customFrequency: number | null;
  goal: string | null;
  timeOfDay: TimeOfDay | null;
  notes: string | null;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}
