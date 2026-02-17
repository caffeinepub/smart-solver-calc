# Specification

## Summary
**Goal:** Build a multi-mode smart calculator for Math, Physics, and Chemistry that produces deterministic, step-by-step solutions (no external AI), with authenticated per-user history.

**Planned changes:**
- Create a home UI with three modes (Math, Physics, Chemistry), each offering structured inputs and/or a free-text prompt plus a Solve action.
- Implement a single Motoko actor backend exposing typed solver methods (or one method with a mode selector) returning `finalAnswer`, `steps`, and computed key/value data.
- Add a Math expression solver supporting functions/constants (sin, cos, tan, log, ln, sqrt, pi, e), parentheses, exponents, and step-by-step parse/evaluation breakdown; render steps in a monospaced style.
- Add Physics topic-based form solvers (kinematics, F=m*a, work/energy, power, Ohm’s law) that can solve for any one variable, include units, and show formula/substitution/computation steps.
- Add Chemistry topic-based form solvers (molar mass, moles↔mass, molarity, dilution, ideal gas law, pH/pOH) with validation and step-by-step outputs.
- Implement Internet Identity sign-in and a History view to list, re-run, delete, and clear per-user solved items (mode, inputs, timestamp, final answer).
- Apply a consistent modern scientific visual theme (not blue/purple) across all states (loading, error, empty).
- Use React Query for solver calls and history CRUD with loading states, disabled Solve while pending, friendly error handling, input validation, caching per mode/topic, and a Re-solve action.
- Add and render static branding assets (logo in header; hero illustration on landing/selection area) from `frontend/public/assets/generated`.

**User-visible outcome:** Users can choose Math/Physics/Chemistry, enter a problem via forms or text, get a final answer plus step-by-step reasoning, sign in with Internet Identity, and manage a personal history of past calculations.
