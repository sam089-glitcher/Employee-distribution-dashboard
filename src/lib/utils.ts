import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Performance color utilities
export function getPerformanceColor(score: number): string {
  if (score >= 4.5) return '#70ad47'; // Excellent - Green
  if (score >= 3.5) return '#92d050'; // Good - Light Green  
  if (score >= 2.5) return '#ffc000'; // Average - Yellow
  if (score >= 1.5) return '#ff9900'; // Below Average - Orange
  return '#c5504b'; // Poor - Red
}

export function getPerformanceColorClass(score: number): string {
  if (score >= 4.5) return 'text-green-600 bg-green-50';
  if (score >= 3.5) return 'text-green-500 bg-green-50';
  if (score >= 2.5) return 'text-yellow-600 bg-yellow-50';
  if (score >= 1.5) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
}

export function getEngagementColor(score: number): string {
  if (score >= 4) return '#70ad47';
  if (score >= 3) return '#92d050';
  if (score >= 2) return '#ffc000';
  return '#ff9900';
}

// Department color mapping
export const departmentColors: { [key: string]: string } = {
  'Engineering': '#1f4e79',
  'Sales': '#c5504b',
  'Marketing': '#70ad47',
  'HR': '#ff9900',
  'Finance': '#2e75b6',
  'Operations': '#7f7f7f',
  'Customer Service': '#ffc000',
  'Product': '#92d050',
  'Legal': '#c55a5a',
  'IT': '#5b9bd5'
};

export function getDepartmentColor(department: string): string {
  return departmentColors[department] || '#7f7f7f';
}
