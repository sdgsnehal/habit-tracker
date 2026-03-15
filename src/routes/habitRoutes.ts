import { Router, Request, Response } from "express";
import { HabitController } from "../controllers/habitController";

const router = Router();

/**
 * POST /api/habits
 * Create a new habit
 *
 * Request body:
 * {
 *   "userId": 1,
 *   "name": "Morning Run",
 *   "icon": "running",
 *   "color": "#45B7D1",
 *   "frequencyType": "specific_days",
 *   "daysOfWeek": ["Monday", "Wednesday", "Friday"],
 *   "goal": "Run 5 kilometers",
 *   "timeOfDay": "morning",
 *   "notes": "Start at 6 AM",
 *   "startDate": "2026-03-15"
 * }
 */
router.post("/", HabitController.createHabit);

export default router;
