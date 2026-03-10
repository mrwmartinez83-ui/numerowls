# NumerOwls TODO

## Fun Improvements for Primary Pupils
- [x] Install canvas-confetti for celebration animations
- [x] Create useConfetti hook (fireCorrectConfetti, fireBigCelebration, firePerfectScore)
- [x] Animated answer feedback (colour flash, scale bounce) in SkillPractice
- [x] Animated answer feedback (feedback message overlay) in TimedTest
- [x] Encouraging messages (randomised "Amazing!", "Brilliant!" etc.) in both pages
- [x] XP field added to users table (schema + db:push)
- [x] Streak fields added to users table (currentStreak, longestStreak, lastPracticeDate)
- [x] results.save computes and stores XP + streak server-side
- [x] streak_5 badge auto-awarded at 5-day streak
- [x] XP level badge + mini progress bar added to NavBar
- [x] Streak flame badge added to NavBar
- [x] XP bar + streak display added to PupilDashboard hero
- [x] OwlMascot component with mood-based reactions (happy/sad/excited/celebrating)
- [x] OwlMascot added to TimedTest finished screen
- [x] Owl keyframe animations (bounce, wiggle, shake, pulse, fadeIn) in index.css

## Previously Completed
- [x] Question bank with 460 questions
- [x] Visual diagram support for 40+ questions
- [x] Consistent fraction rendering
- [x] Admin Question Bank Browser
- [x] Database schema for POTW
- [x] Badges system
- [x] Teacher Dashboard
- [x] Timed Test with results
- [x] Skill Practice
- [x] Leaderboard

## Games Hub
- [ ] Create Countdown game component
- [ ] Create Number Bond Memory game component
- [ ] Create Magic Square game component
- [ ] Create Function Machine game component
- [ ] Create Times Table Blitz game (new)
- [ ] Create Fraction Snap game (new)
- [ ] Create Number Ninja game (new)
- [ ] Build Games Hub page with all 7 games
- [ ] Add Games Hub to NavBar and App routes
- [ ] Add Games Hub to Dashboard Quick Actions

## Escape Rooms
- [ ] Build shared EscapeRoom engine (stage renderer, hint system, lock animations, story panels)
- [ ] Build Bronze room: The Enchanted Forest (Y1-3, 5 stages)
- [ ] Build Silver room: The Pirate's Vault (Y3-5, 5 stages)
- [ ] Build Gold room: The Space Station Crisis (Y5-6, 5 stages)
- [ ] Build Escape Rooms Hub page
- [ ] Wire Escape Rooms into NavBar, Games Hub, Dashboard

## Navigation Redesign
- [x] Slim NavBar: logo + 4 primary links + hamburger slide-out for all pages
- [x] Hamburger menu groups pages by category (Learn, Play, Compete, More)
- [x] PupilDashboard: big visual activity hub with large emoji cards for each activity
- [x] Ensure all pages reachable from the dashboard hub cards

## POTW Improvements (Round 2)
- [ ] Add 20+ new POTW questions with SVG diagrams (Years 1-6)
- [ ] Build POTW archive page /potw/archive
- [ ] Add in-app result notification (DB flag + alert banner on pupil dashboard/POTW page)
- [ ] Wire archive link into NavBar hamburger menu and POTW page
