import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  CreateHabitDTO,
  BUILT_IN_ICONS,
  PRESET_COLORS,
  DayOfWeek,
} from "../types/habit";

export class HabitController {
  // Validate habit creation request
  private static validateCreateHabitRequest(data: any): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate required fields
    if (!data.name || typeof data.name !== "string") {
      errors.push("Habit name is required and must be a string");
    } else if (data.name.length > 50) {
      errors.push("Habit name must not exceed 50 characters");
    }

    if (!data.icon || typeof data.icon !== "string") {
      errors.push("Icon is required and must be a string");
    } else if (!BUILT_IN_ICONS.includes(data.icon)) {
      errors.push(
        `Icon must be one of the built-in icons: ${BUILT_IN_ICONS.join(", ")}`,
      );
    }

    if (!data.color || typeof data.color !== "string") {
      errors.push("Color is required and must be a string");
    } else if (!PRESET_COLORS.includes(data.color)) {
      errors.push(
        `Color must be one of the preset colors: ${PRESET_COLORS.join(", ")}`,
      );
    }

    if (!data.frequencyType || typeof data.frequencyType !== "string") {
      errors.push("Frequency type is required and must be a string");
    } else if (
      !["daily", "specific_days", "custom"].includes(data.frequencyType)
    ) {
      errors.push(
        "Frequency type must be one of: daily, specific_days, custom",
      );
    }

    // Validate frequency-specific fields
    if (data.frequencyType === "specific_days") {
      if (
        !data.daysOfWeek ||
        !Array.isArray(data.daysOfWeek) ||
        data.daysOfWeek.length === 0
      ) {
        errors.push(
          'When frequency type is "specific_days", daysOfWeek array is required and must not be empty',
        );
      } else {
        const validDays = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        const invalidDays = data.daysOfWeek.filter(
          (day: any) => !validDays.includes(day),
        );
        if (invalidDays.length > 0) {
          errors.push(
            `Invalid days: ${invalidDays.join(", ")}. Valid days are: ${validDays.join(", ")}`,
          );
        }
      }
    }

    if (data.frequencyType === "custom") {
      if (
        typeof data.customFrequency !== "number" ||
        data.customFrequency < 1 ||
        data.customFrequency > 7
      ) {
        errors.push(
          'When frequency type is "custom", customFrequency must be a number between 1 and 7',
        );
      }
    }

    // Validate optional fields
    if (
      data.goal &&
      (typeof data.goal !== "string" || data.goal.length === 0)
    ) {
      errors.push("Goal must be a non-empty string if provided");
    }

    if (
      data.timeOfDay &&
      !["morning", "afternoon", "evening", "anytime"].includes(data.timeOfDay)
    ) {
      errors.push(
        "Time of day must be one of: morning, afternoon, evening, anytime",
      );
    }

    if (
      data.notes &&
      (typeof data.notes !== "string" || data.notes.length > 200)
    ) {
      errors.push("Notes must be a string not exceeding 200 characters");
    }

    if (data.startDate && isNaN(new Date(data.startDate).getTime())) {
      errors.push("Start date must be a valid date");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Create a new habit
  static async createHabit(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId; // Should be set from auth middleware in production

      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      // Validate request
      const validation = this.validateCreateHabitRequest(req.body);
      if (!validation.valid) {
        res.status(400).json({
          error: "Validation failed",
          details: validation.errors,
        });
        return;
      }

      const {
        name,
        icon,
        color,
        frequencyType,
        daysOfWeek,
        customFrequency,
        goal,
        timeOfDay,
        notes,
        startDate,
      } = req.body as CreateHabitDTO;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Create habit
      const habit = await prisma.habit.create({
        data: {
          userId,
          name: name.trim(),
          icon,
          color,
          frequencyType,
          daysOfWeek: daysOfWeek ? JSON.stringify(daysOfWeek) : null,
          customFrequency,
          goal: goal?.trim(),
          timeOfDay,
          notes: notes?.trim(),
          startDate: startDate ? new Date(startDate) : new Date(),
        },
      });

      // Format response
      const response = {
        id: habit.id,
        userId: habit.userId,
        name: habit.name,
        icon: habit.icon,
        color: habit.color,
        frequencyType: habit.frequencyType,
        daysOfWeek: habit.daysOfWeek ? JSON.parse(habit.daysOfWeek) : null,
        customFrequency: habit.customFrequency,
        goal: habit.goal,
        timeOfDay: habit.timeOfDay,
        notes: habit.notes,
        startDate: habit.startDate.toISOString(),
        createdAt: habit.createdAt.toISOString(),
        updatedAt: habit.updatedAt.toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      console.error("Error creating habit:", error);
      res.status(500).json({
        error: "Failed to create habit",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
