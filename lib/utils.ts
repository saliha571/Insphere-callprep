import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() — class merging utility
 *
 * Combines clsx (conditional class logic) with tailwind-merge
 * (conflict resolution) so component tokens compose cleanly.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-primary text-primary-foreground")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
