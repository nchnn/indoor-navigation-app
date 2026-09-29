/*
 * File: src/types/user.ts
 * Shared UserProfile type used across auth, store, and App.
 */

export type UserProfile =
  | { type: 'edu'; name: string; email: string }
  | { type: 'guest'; name: string };
