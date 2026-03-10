import { EscapeRoom, EscapeStage, rand, randFrom, isPrime } from "./escapeTypes";

// ─── Gold Room: The Space Station Crisis ─────────────────────────────────────
// Year 5–6 · 5 stages · Themes: algebra, prime numbers, percentages,
// ratio/proportion, order of operations (BIDMAS)

function generateGoldRoom(): EscapeRoom {

  // ── Stage 1: The Airlock ─────────────────────────────────────────────────
  // Puzzle: BIDMAS / order of operations.
  // Four expressions — evaluate each correctly. The answers form the airlock code.
  function makeExpression(): { expr: string; ans: number } {
    const a = rand(2, 9), b = rand(2, 9), c = rand(2, 9), d = rand(2, 5);
    // Form: a + b × c - d  (multiplication first)
    const ans = a + b * c - d;
    return { expr: `${a} + ${b} × ${c} − ${d}`, ans };
  }
  function makeExpression2(): { expr: string; ans: number } {
    const a = rand(2, 8), b = rand(2, 5), c = rand(1, 6);
    // Form: (a + b) × c
    const ans = (a + b) * c;
    return { expr: `(${a} + ${b}) × ${c}`, ans };
  }
  function makeExpression3(): { expr: string; ans: number } {
    const a = rand(10, 50), b = rand(2, 6), c = rand(1, 5);
    // Form: a ÷ b + c  (division first)
    const safeA = a - (a % b); // ensure clean division
    const ans = safeA / b + c;
    return { expr: `${safeA} ÷ ${b} + ${c}`, ans };
  }
  function makeExpression4(): { expr: string; ans: number } {
    const a = rand(2, 6);
    const b = rand(2, 4);
    const c = rand(1, 5);
    // Form: a² + b × c
    const ans = a * a + b * c;
    return { expr: `${a}² + ${b} × ${c}`, ans };
  }
  const exprs = [makeExpression(), makeExpression2(), makeExpression3(), makeExpression4()];
  const s1code = exprs.map(e => e.ans).join("-");

  const stage1: EscapeStage = {
    id: 1,
    name: "The Airlock",
    scene: "Red emergency lights flash. The airlock keypad demands a 4-part code.",
    sceneEmoji: "🚀",
    storyIntro: `**ALERT! ALERT!** Red lights strobe across the space station. You're trapped in the airlock — the outer door has sealed and the inner door won't open without the emergency code.\n\nThe keypad screen reads:\n\n*"Enter the results of the four calculations in order, separated by dashes. Remember: BIDMAS applies — Brackets, Indices, Division, Multiplication, Addition, Subtraction."*\n\nYou have to get this right. There's no air in the airlock.`,
    puzzle: {
      type: "cipher_lock",
      title: "BIDMAS Emergency Code",
      flavourText: "Evaluate each expression using the correct order of operations (BIDMAS). Enter the four answers separated by dashes.",
      clues: exprs.map((e, i) => ({
        id: `s1_${i}`,
        label: `🔢 Expression ${i + 1}`,
        question: `**${e.expr} = ?**`,
        answer: e.ans,
        visual: "🔢",
      })),
      lockCode: s1code,
      hints: [
        { text: `Expression 1: ${exprs[0].expr}. Do multiplication/division before addition/subtraction. Answer: ${exprs[0].ans}`, cost: 30 },
        { text: `Answers so far: ${exprs[0].ans}, ${exprs[1].ans}. Keep going!`, cost: 60 },
        { text: `Code: ${s1code}`, cost: 120 },
      ],
      successText: "The inner airlock door hisses open. You tumble into the station corridor, gasping.",
    },
    storyOutro: "You tumble through the inner door as it seals behind you. The station hums with failing power. You need to reach the control room — fast.",
  };

  // ── Stage 2: The Reactor Core ────────────────────────────────────────────
  // Puzzle: Prime numbers. The reactor core has 5 fuel rods numbered.
  // Only the prime-numbered rods are safe to activate.
  // The sum of the safe rod numbers is the reactor code.
  const rodNumbers = Array.from({ length: 8 }, () => rand(2, 60));
  // ensure we have at least 3 primes
  const primeRods = rodNumbers.filter(isPrime);
  const nonPrimeRods = rodNumbers.filter(n => !isPrime(n));
  // Guarantee exactly 4 primes and 4 non-primes for a clean puzzle
  const fixedPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  const chosenPrimes = fixedPrimes.sort(() => Math.random() - 0.5).slice(0, 4);
  const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25];
  const chosenComposites = composites.sort(() => Math.random() - 0.5).slice(0, 4);
  const allRods = [...chosenPrimes, ...chosenComposites].sort(() => Math.random() - 0.5);
  const safeRodSum = chosenPrimes.reduce((a, b) => a + b, 0);
  const s2code = String(safeRodSum);

  const stage2: EscapeStage = {
    id: 2,
    name: "The Reactor Core",
    scene: "Eight glowing fuel rods line the reactor wall. The wrong ones will cause a meltdown.",
    sceneEmoji: "⚛️",
    storyIntro: `The reactor core! Eight fuel rods glow with different colours. A warning screen flashes:\n\n*"DANGER: Only activate the PRIME-numbered fuel rods. Activating a non-prime rod will trigger a meltdown. Add up the numbers on all the safe (prime) rods. Enter the total as the reactor stabilisation code."*\n\nThe station shudders. You need to be fast — and accurate.`,
    puzzle: {
      type: "logic_grid",
      title: "Prime Fuel Rods",
      flavourText: `The 8 fuel rods are numbered: **${allRods.join(", ")}**\n\nIdentify which numbers are **prime**. Add up only the prime rod numbers. Enter the total as the code.\n\n*(A prime number has exactly 2 factors: 1 and itself.)*`,
      clues: [
        {
          id: "s2_rods",
          label: "⚛️ Fuel Rods",
          question: `Rod numbers: **${allRods.join(", ")}**\n\nWhich are prime? Circle them, then add them up.\n\nPrime rods: ___\n\nTotal: ___`,
          answer: safeRodSum,
          visual: "⚛️",
        },
      ],
      lockCode: s2code,
      hints: [
        { text: `Check each number: is it divisible by anything other than 1 and itself? The primes here are: ${chosenPrimes.join(", ")}`, cost: 30 },
        { text: `Safe primes: ${chosenPrimes.join(" + ")} = ${safeRodSum}`, cost: 60 },
        { text: `Code: ${s2code}`, cost: 120 },
      ],
      successText: "The reactor stabilises with a deep hum. Green lights replace the red. The corridor ahead is clear.",
    },
    storyOutro: "The reactor hum changes from a shriek to a steady pulse. Green lights flicker on. You sprint towards the navigation bay.",
  };

  // ── Stage 3: The Navigation Bay ──────────────────────────────────────────
  // Puzzle: Algebra — solve equations to find coordinates.
  // The coordinates point to the escape pod bay number.
  const s3_x_ans = rand(3, 12);
  const s3_coeff = rand(2, 6);
  const s3_add = rand(1, 15);
  const s3_rhs = s3_coeff * s3_x_ans + s3_add;

  const s3_y_ans = rand(3, 12);
  const s3_coeff2 = rand(2, 5);
  const s3_sub = rand(1, 10);
  const s3_rhs2 = s3_coeff2 * s3_y_ans - s3_sub;

  const s3_z_ans = rand(2, 10);
  const s3_coeff3 = rand(3, 7);
  const s3_rhs3 = s3_coeff3 * s3_z_ans;

  const s3code = `${s3_x_ans}${s3_y_ans}${s3_z_ans}`;

  const stage3: EscapeStage = {
    id: 3,
    name: "The Navigation Bay",
    scene: "Star charts cover every screen. Three equations are etched into the navigation console.",
    sceneEmoji: "🌌",
    storyIntro: `The navigation bay is filled with star charts and blinking screens. The escape pod coordinates are locked behind three algebraic equations, etched into the console:\n\n*"Solve for x, y, and z. The three values — in order — are the pod bay coordinates."*\n\nYou crack your knuckles. Time to think.`,
    puzzle: {
      type: "algebra_vault",
      title: "The Navigation Equations",
      flavourText: "Solve each equation. Enter the three values of x, y, z in order (no spaces or dashes).",
      clues: [
        {
          id: "s3a",
          label: "🌌 Equation 1 — find x",
          question: `**${s3_coeff}x + ${s3_add} = ${s3_rhs}**\n\nSolve for x: ___`,
          answer: s3_x_ans,
          visual: "🌌",
        },
        {
          id: "s3b",
          label: "🌌 Equation 2 — find y",
          question: `**${s3_coeff2}y − ${s3_sub} = ${s3_rhs2}**\n\nSolve for y: ___`,
          answer: s3_y_ans,
          visual: "🌌",
        },
        {
          id: "s3c",
          label: "🌌 Equation 3 — find z",
          question: `**${s3_coeff3}z = ${s3_rhs3}**\n\nSolve for z: ___`,
          answer: s3_z_ans,
          visual: "🌌",
        },
      ],
      lockCode: s3code,
      hints: [
        { text: `Eq 1: subtract ${s3_add} from both sides → ${s3_coeff}x = ${s3_rhs - s3_add} → x = ${s3_x_ans}`, cost: 30 },
        { text: `x = ${s3_x_ans}, y = ${s3_y_ans}. Now find z.`, cost: 60 },
        { text: `Code: ${s3code}`, cost: 120 },
      ],
      successText: "The navigation screen lights up: POD BAY LOCATED. You sprint for the escape pods.",
    },
    storyOutro: "The navigation screen flashes the pod bay location. You sprint down the corridor, the station groaning around you.",
  };

  // ── Stage 4: The Life Support Room ──────────────────────────────────────
  // Puzzle: Percentages and ratio.
  // Oxygen tanks show percentage full. Calculate actual litres.
  // Ratio puzzle to mix gases correctly.
  const s4_tank_cap = rand(200, 500);
  const s4_pct1 = randFrom([25, 40, 60, 75, 80]);
  const s4_ans1 = (s4_tank_cap * s4_pct1) / 100;

  const s4_ratio_a = rand(2, 5);
  const s4_ratio_b = rand(2, 5);
  const s4_total_parts = s4_ratio_a + s4_ratio_b;
  const s4_total_mix = s4_total_parts * rand(10, 20);
  const s4_ans2 = (s4_total_mix / s4_total_parts) * s4_ratio_a;
  const s4_ans3 = (s4_total_mix / s4_total_parts) * s4_ratio_b;

  const s4code = `${s4_ans1}-${s4_ans2}`;

  const stage4: EscapeStage = {
    id: 4,
    name: "The Life Support Room",
    scene: "Oxygen tanks line the walls. Warning lights flash — the mix is wrong.",
    sceneEmoji: "🫁",
    storyIntro: `The life support room! The oxygen-nitrogen mix is dangerously wrong. Two calculations will fix it:\n\n*"1. Calculate how many litres of oxygen are in the main tank. 2. The correct gas mix is ${s4_ratio_a}:${s4_ratio_b} (oxygen:nitrogen). Calculate how many litres of oxygen are needed in a ${s4_total_mix}-litre mixture. Enter both answers separated by a dash."*\n\nYou can feel the air getting thin.`,
    puzzle: {
      type: "cipher_lock",
      title: "Oxygen Mix Calculations",
      flavourText: "Solve both calculations. Enter the two answers separated by a dash.",
      clues: [
        {
          id: "s4a",
          label: "🫁 Tank Level",
          question: `The main oxygen tank holds **${s4_tank_cap} litres** when full. It is currently **${s4_pct1}% full**.\n\nHow many litres of oxygen are in the tank?`,
          answer: s4_ans1,
          visual: "🫁",
        },
        {
          id: "s4b",
          label: "⚗️ Gas Mix",
          question: `The correct mix is **${s4_ratio_a}:${s4_ratio_b}** (oxygen:nitrogen).\n\nIn a **${s4_total_mix}-litre** mixture, how many litres should be **oxygen**?`,
          answer: s4_ans2,
          visual: "⚗️",
        },
      ],
      lockCode: s4code,
      hints: [
        { text: `Tank: ${s4_pct1}% of ${s4_tank_cap} = ${s4_tank_cap} × ${s4_pct1} ÷ 100 = ${s4_ans1} litres.`, cost: 30 },
        { text: `Tank: ${s4_ans1} litres. Mix: total parts = ${s4_total_parts}, oxygen parts = ${s4_ratio_a}, so oxygen = ${s4_total_mix} ÷ ${s4_total_parts} × ${s4_ratio_a} = ${s4_ans2} litres.`, cost: 60 },
        { text: `Code: ${s4code}`, cost: 120 },
      ],
      successText: "The life support system beeps green. Fresh air floods the station!",
    },
    storyOutro: "Fresh oxygen floods the station. You take a deep breath and run for the escape pod bay.",
  };

  // ── Stage 5: The Escape Pod ──────────────────────────────────────────────
  // Puzzle: Multi-step problem involving speed/distance/time and algebra.
  // The pod launch sequence requires solving 3 connected problems.
  const s5_speed = rand(200, 800); // km/h
  const s5_time_mins = rand(30, 90); // minutes
  const s5_distance = (s5_speed * s5_time_mins) / 60;

  const s5_fuel_total = rand(500, 1000);
  const s5_fuel_pct = randFrom([20, 25, 40, 50]);
  const s5_fuel_used = (s5_fuel_total * s5_fuel_pct) / 100;
  const s5_fuel_left = s5_fuel_total - s5_fuel_used;

  const s5_n = rand(3, 8);
  const s5_sum = s5_n * (s5_n + 1) / 2; // triangular number
  const s5code = `${s5_distance}-${s5_fuel_left}-${s5_sum}`;

  const stage5: EscapeStage = {
    id: 5,
    name: "The Escape Pod",
    scene: "A gleaming escape pod sits ready. The launch console demands three final answers.",
    sceneEmoji: "🛸",
    storyIntro: `THE ESCAPE POD! It gleams under the emergency lights. You leap inside and the hatch seals. The launch console flashes:\n\n*"LAUNCH SEQUENCE INITIATED. Three calculations required. Enter all three answers separated by dashes. You have one chance."*\n\nThe station shudders violently. This is it.`,
    puzzle: {
      type: "algebra_vault",
      title: "Launch Sequence Calculations",
      flavourText: "Solve all three calculations. Enter the answers separated by dashes.",
      clues: [
        {
          id: "s5a",
          label: "🚀 Calculation 1 — Distance",
          question: `The pod travels at **${s5_speed} km/h** for **${s5_time_mins} minutes**.\n\nHow many kilometres does it travel?\n\n*(Hint: convert minutes to hours first: ${s5_time_mins} ÷ 60)*`,
          answer: s5_distance,
          visual: "🚀",
        },
        {
          id: "s5b",
          label: "⛽ Calculation 2 — Fuel",
          question: `The pod starts with **${s5_fuel_total} litres** of fuel. It uses **${s5_fuel_pct}%** during launch.\n\nHow many litres are **left** after launch?`,
          answer: s5_fuel_left,
          visual: "⛽",
        },
        {
          id: "s5c",
          label: "🔢 Calculation 3 — Sequence",
          question: `What is the sum of all whole numbers from **1 to ${s5_n}**?\n\n*(1 + 2 + 3 + ... + ${s5_n} = ?)*`,
          answer: s5_sum,
          visual: "🔢",
        },
      ],
      lockCode: s5code,
      hints: [
        { text: `Calc 1: ${s5_speed} × (${s5_time_mins}/60) = ${s5_speed} × ${s5_time_mins / 60} = ${s5_distance} km`, cost: 30 },
        { text: `Calc 1: ${s5_distance}. Calc 2: ${s5_fuel_pct}% of ${s5_fuel_total} = ${s5_fuel_used}, so ${s5_fuel_total} − ${s5_fuel_used} = ${s5_fuel_left}.`, cost: 60 },
        { text: `Code: ${s5code}`, cost: 120 },
      ],
      successText: "LAUNCH CONFIRMED! The pod blasts free of the station in a roar of fire!",
    },
    storyOutro: "BOOM! The escape pod rockets away from the crumbling station. Through the porthole, you watch it drift apart in slow motion. You did it. You solved every puzzle and escaped the Space Station Crisis. 🌟",
  };

  return {
    id: "gold",
    tier: "gold",
    title: "The Space Station Crisis",
    subtitle: "Solve the maths. Save the crew. Escape before it's too late.",
    theme: "Sci-Fi Space",
    emoji: "🌌",
    color: "#FFD700",
    bgGradient: "linear-gradient(135deg, #020818 0%, #0a1628 50%, #020818 100%)",
    yearRange: "Years 5–6",
    description: "The space station is failing! Work through 5 high-stakes mathematical challenges to restore power, stabilise the reactor, and launch the escape pod before the station is destroyed.",
    storyIntro: "You're on a routine school trip to Space Station Omega when all the lights go out. Emergency klaxons blare. The AI announces: **'Critical system failure. Station will self-destruct in T-minus 60 minutes.'** A screen flickers to life: *'Solve 5 mathematical challenges to restore systems and escape.'* The fate of the crew is in your hands.",
    storyOutro: "The escape pod streaks through space as the station explodes in a brilliant flash behind you. Earth appears on the viewscreen. You solved every challenge and saved the crew. You are a mathematical hero. 🏆",
    stages: [stage1, stage2, stage3, stage4, stage5],
    generate: generateGoldRoom,
  };
}

export { generateGoldRoom };
