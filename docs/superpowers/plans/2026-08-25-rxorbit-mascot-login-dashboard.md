# RxOrbit Mascot Login Dashboard Implementation Plan

## Goal
Add a premium, minimal RxOrbit login experience inspired by mascot-login interfaces, followed by an RxOrbit-specific pharmacy intelligence dashboard.

## Design
- Off-white, light gray, soft charcoal palette; no blue and minimal black.
- Animated phone intro with restrained 3D rotation.
- Login card with email, password, floating labels, Google option, and 30-day remember checkbox.
- Three friendly abstract CSS mascots that track focus, react to password validation, celebrate successful login, and shake subtly on invalid password.
- Successful login transitions into a responsive dashboard with RxOrbit opportunity metrics, customer cards, insights, filters, and activity.
- No autoplay music; provide a muted optional sound affordance only if audio is later added.
- Respect prefers-reduced-motion.

## File Structure
- `rxorbit-login-dashboard.html`: self-contained frontend prototype for login + dashboard, preserving the existing RxOrbit visual language while adding the approved interaction layer.

## Implementation Tasks
1. Create the standalone login/dashboard prototype.
2. Add responsive CSS and visible micro-animations.
3. Add mascot state transitions for focus, password validation, success, and error.
4. Add login-to-dashboard transition and dashboard metrics/cards.
5. Add keyboard/accessibility and reduced-motion behavior.
6. Verify the HTML structure and JavaScript syntax before considering the prototype complete.
