import { EscapeRoom, EscapeStage, rand, randFrom, numToLetter } from "./escapeTypes";

// ─── Silver Room: The Pirate's Vault ─────────────────────────────────────────
// Year 3–5 · 5 stages · Themes: multiplication, division, fractions,
// factors/multiples, area/perimeter

function generateSilverRoom(): EscapeRoom {

  // ── Stage 1: The Sunken Deck ─────────────────────────────────────────────
  // Puzzle: Three treasure chests show multiplication clues.
  // Each answer gives one digit of the hatch code.
  const s1_a = rand(3, 9); const s1_b = rand(3, 9);
  const s1_c = rand(3, 9); const s1_d = rand(3, 9);
  const s1_e = rand(3, 9); const s1_f = rand(3, 9);
  const s1_ans1 = (s1_a * s1_b) % 10 || 1;
  const s1_ans2 = (s1_c * s1_d) % 10 || 2;
  const s1_ans3 = (s1_e * s1_f) % 10 || 3;
  const s1code = `${s1_ans1}${s1_ans2}${s1_ans3}`;

  const stage1: EscapeStage = {
    id: 1,
    name: "The Sunken Deck",
    scene: "Barnacle-covered planks creak beneath your feet. Three rusted chests are bolted to the deck.",
    sceneEmoji: "🚢",
    storyIntro: `The pirate ship has sunk to the ocean floor, but somehow you're still breathing — magic! You stand on the slippery deck surrounded by seaweed and glinting coins. A waterlogged map is nailed to the mast:\n\n*"Three chests guard the hatch below. Solve each chest's multiplication. Take the units digit of each answer — those three digits open the hatch."*\n\nThe treasure vault lies below...`,
    puzzle: {
      type: "cipher_lock",
      title: "The Three Chests",
      flavourText: "Solve each multiplication. Take only the **units digit** (last digit) of each answer. Those three digits — in order — are the hatch code.",
      clues: [
        { id: "s1a", label: "⚓ Chest 1", question: `**${s1_a} × ${s1_b} = ?**\n\nUnits digit of the answer: ___`, answer: s1_ans1, visual: "📦" },
        { id: "s1b", label: "⚓ Chest 2", question: `**${s1_c} × ${s1_d} = ?**\n\nUnits digit of the answer: ___`, answer: s1_ans2, visual: "📦" },
        { id: "s1c", label: "⚓ Chest 3", question: `**${s1_e} × ${s1_f} = ?**\n\nUnits digit of the answer: ___`, answer: s1_ans3, visual: "📦" },
      ],
      lockCode: s1code,
      hints: [
        { text: `${s1_a} × ${s1_b} = ${s1_a * s1_b}. The units digit is ${s1_ans1}.`, cost: 30 },
        { text: `Chest 1: ${s1_ans1}, Chest 2: units digit of ${s1_c * s1_d} = ${s1_ans2}. Find Chest 3.`, cost: 60 },
        { text: `Code: ${s1code}`, cost: 120 },
      ],
      successText: "The hatch bursts open! A shaft of light pierces the murky water below.",
    },
    storyOutro: "The hatch swings open with a clang. You climb down a ladder into the ship's hold, dripping but determined.",
  };

  // ── Stage 2: The Captain's Quarters ─────────────────────────────────────
  // Puzzle: A coded message uses A=1, B=2... Z=26.
  // Solve 4 division problems, map answers to letters, spell a word.
  // The word is the password.
  const words = ["GOLD", "SHIP", "MAPS", "SAIL", "TIDE", "REEF", "HELM"];
  const word = randFrom(words);
  const letterValues = word.split("").map(ch => ch.charCodeAt(0) - 64); // A=1
  // Create division clues: answer = letterValue, so clue = letterValue * divisor ÷ divisor
  const divisors = letterValues.map(() => rand(2, 9));
  const dividends = letterValues.map((v, i) => v * divisors[i]);

  const stage2: EscapeStage = {
    id: 2,
    name: "The Captain's Quarters",
    scene: "A grand cabin with maps pinned to every wall. A coded message sits on the captain's desk.",
    sceneEmoji: "🗺️",
    storyIntro: `The captain's quarters are surprisingly dry. Charts and maps cover every wall. On the desk lies a coded message:\n\n*"In this code, A=1, B=2, C=3... Z=26. Solve each division to find a number. Convert each number to its letter. The letters spell the password to the vault door."*\n\nThe vault door gleams at the back of the cabin.`,
    puzzle: {
      type: "word_code",
      title: "The Captain's Cipher",
      flavourText: `Solve each division. Convert each answer to a letter using **A=1, B=2, C=3... Z=26**. The letters spell a ${word.length}-letter word — that's the password. Enter the word in CAPITALS.`,
      clues: letterValues.map((v, i) => ({
        id: `s2_${i}`,
        label: `🔤 Letter ${i + 1}`,
        question: `**${dividends[i]} ÷ ${divisors[i]} = ?**\n\nConvert to letter (A=1, B=2...): ___`,
        answer: v,
        visual: "🔤",
      })),
      lockCode: word,
      hints: [
        { text: `First division: ${dividends[0]} ÷ ${divisors[0]} = ${letterValues[0]}. That's the letter ${word[0]}.`, cost: 30 },
        { text: `First two letters: ${word.slice(0, 2)}. Keep solving the divisions.`, cost: 60 },
        { text: `The word is ${word}.`, cost: 120 },
      ],
      successText: `The vault door clicks open. "${word}" — the captain's favourite word!`,
    },
    storyOutro: "The vault door swings open with a satisfying click. Inside, a spiral staircase leads down to the treasure hold.",
  };

  // ── Stage 3: The Treasure Hold ───────────────────────────────────────────
  // Puzzle: Bags of gold coins. Each bag has a label showing a fraction of a total.
  // Find how many coins are in each bag. The totals form the combination.
  const s3_total1 = rand(4, 8) * 10; // e.g. 40, 50, 60...
  const s3_frac1_num = rand(1, 3);
  const s3_frac1_den = rand(4, 8);
  // ensure clean division
  const s3_total1_clean = s3_frac1_den * rand(3, 6);
  const s3_ans1 = (s3_total1_clean * s3_frac1_num) / s3_frac1_den;

  const s3_total2 = rand(3, 7) * 12;
  const s3_frac2_num = rand(1, 3);
  const s3_frac2_den = rand(3, 6);
  const s3_total2_clean = s3_frac2_den * rand(4, 7);
  const s3_ans2 = (s3_total2_clean * s3_frac2_num) / s3_frac2_den;

  const s3_total3 = rand(2, 5) * 15;
  const s3_frac3_num = rand(1, 2);
  const s3_frac3_den = rand(3, 5);
  const s3_total3_clean = s3_frac3_den * rand(3, 5);
  const s3_ans3 = (s3_total3_clean * s3_frac3_num) / s3_frac3_den;

  const s3code = `${s3_ans1}-${s3_ans2}-${s3_ans3}`;

  const stage3: EscapeStage = {
    id: 3,
    name: "The Treasure Hold",
    scene: "Piles of gold coins glitter in the lamplight. Three large bags are padlocked shut.",
    sceneEmoji: "💰",
    storyIntro: `The treasure hold glitters with gold! But three enormous bags are padlocked. A sign reads:\n\n*"Each bag holds a fraction of a total. Find how many coins are in each bag. The three amounts — separated by dashes — unlock the main chest."*\n\nYour fingers itch with excitement.`,
    puzzle: {
      type: "cipher_lock",
      title: "The Three Gold Bags",
      flavourText: "Find the number of coins in each bag. Enter the three amounts separated by dashes (e.g. 12-8-15).",
      clues: [
        {
          id: "s3a",
          label: "💰 Bag 1",
          question: `Bag 1 holds **${s3_frac1_num}/${s3_frac1_den}** of **${s3_total1_clean}** coins.\n\nHow many coins is that?`,
          answer: s3_ans1,
          visual: "💰",
        },
        {
          id: "s3b",
          label: "💰 Bag 2",
          question: `Bag 2 holds **${s3_frac2_num}/${s3_frac2_den}** of **${s3_total2_clean}** coins.\n\nHow many coins is that?`,
          answer: s3_ans2,
          visual: "💰",
        },
        {
          id: "s3c",
          label: "💰 Bag 3",
          question: `Bag 3 holds **${s3_frac3_num}/${s3_frac3_den}** of **${s3_total3_clean}** coins.\n\nHow many coins is that?`,
          answer: s3_ans3,
          visual: "💰",
        },
      ],
      lockCode: s3code,
      hints: [
        { text: `Bag 1: divide ${s3_total1_clean} by ${s3_frac1_den}, then multiply by ${s3_frac1_num}. Answer: ${s3_ans1}.`, cost: 30 },
        { text: `Bag 1: ${s3_ans1}, Bag 2: ${s3_ans2}. Find Bag 3.`, cost: 60 },
        { text: `Code: ${s3code}`, cost: 120 },
      ],
      successText: "The main chest bursts open! Inside is a golden key and a map fragment.",
    },
    storyOutro: "You grab the golden key and the map fragment. The map shows a hidden passage leading to the engine room.",
  };

  // ── Stage 4: The Engine Room ─────────────────────────────────────────────
  // Puzzle: Factor pairs. Each gear shows a number. Find all factor pairs.
  // The number of factor pairs for each gear gives a digit of the code.
  const gearNumbers = [rand(12, 30), rand(15, 40), rand(20, 50)];
  function countFactorPairs(n: number): number {
    let count = 0;
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) count++;
    }
    return count;
  }
  const s4_answers = gearNumbers.map(countFactorPairs);
  const s4code = s4_answers.join("");

  const stage4: EscapeStage = {
    id: 4,
    name: "The Engine Room",
    scene: "Massive rusted gears line the walls. A control panel has three dials.",
    sceneEmoji: "⚙️",
    storyIntro: `The engine room is full of enormous gears, each stamped with a number. A control panel has three dials, each showing a gear. A plaque reads:\n\n*"Count the number of factor pairs for each gear's number. Set each dial to that count. The three dial settings — in order — start the engine and open the escape hatch."*\n\n(A factor pair is two numbers that multiply to give the gear number, e.g. factor pairs of 12 are: 1×12, 2×6, 3×4 — that's 3 pairs.)`,
    puzzle: {
      type: "combination_dial",
      title: "The Factor Gears",
      flavourText: "Count the **factor pairs** of each gear number. Enter the three counts in order as the dial code.\n\n*Reminder: factor pairs of 12 → 1×12, 2×6, 3×4 = **3 pairs***",
      clues: gearNumbers.map((n, i) => ({
        id: `s4_${i}`,
        label: `⚙️ Gear ${i + 1}`,
        question: `Gear ${i + 1} shows the number **${n}**.\n\nHow many factor pairs does ${n} have?`,
        answer: s4_answers[i],
        visual: "⚙️",
      })),
      lockCode: s4code,
      hints: [
        { text: `For Gear 1 (${gearNumbers[0]}): try dividing by 1, 2, 3... up to √${gearNumbers[0]} ≈ ${Math.floor(Math.sqrt(gearNumbers[0]))}. Count how many divide evenly.`, cost: 30 },
        { text: `Gear 1 has ${s4_answers[0]} factor pairs. Gear 2 has ${s4_answers[1]} factor pairs. Find Gear 3.`, cost: 60 },
        { text: `Dial code: ${s4code}`, cost: 120 },
      ],
      successText: "The engine roars to life! A hatch in the ceiling slides open.",
    },
    storyOutro: "The engine coughs and splutters, then roars to life. The escape hatch in the ceiling slides open, revealing a ladder leading up.",
  };

  // ── Stage 5: The Escape Hatch ────────────────────────────────────────────
  // Puzzle: Area and perimeter. Four shapes are drawn on the hatch.
  // Calculate area or perimeter of each. The answers form the final code.
  const s5_shapes = [
    { type: "rectangle", w: rand(3, 12), h: rand(3, 12) },
    { type: "square", w: rand(4, 10), h: 0 },
    { type: "rectangle", w: rand(4, 15), h: rand(4, 15) },
    { type: "square", w: rand(5, 12), h: 0 },
  ].map(s => s.type === "square" ? { ...s, h: s.w } : s);

  const s5_questions = [
    { label: "Area of Rectangle A", value: s5_shapes[0].w * s5_shapes[0].h, q: `Rectangle A: width = **${s5_shapes[0].w} cm**, height = **${s5_shapes[0].h} cm**\n\nArea = width × height = ?` },
    { label: "Perimeter of Square B", value: s5_shapes[1].w * 4, q: `Square B: side = **${s5_shapes[1].w} cm**\n\nPerimeter = 4 × side = ?` },
    { label: "Perimeter of Rectangle C", value: 2 * (s5_shapes[2].w + s5_shapes[2].h), q: `Rectangle C: width = **${s5_shapes[2].w} cm**, height = **${s5_shapes[2].h} cm**\n\nPerimeter = 2 × (width + height) = ?` },
    { label: "Area of Square D", value: s5_shapes[3].w * s5_shapes[3].h, q: `Square D: side = **${s5_shapes[3].w} cm**\n\nArea = side × side = ?` },
  ];
  const s5code = s5_questions.map(q => q.value).join("-");

  const stage5: EscapeStage = {
    id: 5,
    name: "The Escape Hatch",
    scene: "A heavy iron hatch with four shape-shaped panels stands between you and freedom.",
    sceneEmoji: "🔓",
    storyIntro: `The escape hatch! Four shape-panels are etched into the iron door, each with measurements. A dial beside each panel must be set to the correct value:\n\n*"Calculate the area or perimeter of each shape. Set each dial to your answer. All four correct — the hatch opens and you escape!"*\n\nYou can almost smell the sea air above...`,
    puzzle: {
      type: "cipher_lock",
      title: "The Shape Panels",
      flavourText: "Calculate area or perimeter for each shape. Enter all four answers separated by dashes (e.g. 24-36-18-49).",
      clues: s5_questions.map((q, i) => ({
        id: `s5_${i}`,
        label: `📐 Panel ${i + 1}: ${q.label}`,
        question: q.q,
        answer: q.value,
        visual: "📐",
      })),
      lockCode: s5code,
      hints: [
        { text: `Panel 1: ${s5_shapes[0].w} × ${s5_shapes[0].h} = ${s5_questions[0].value} cm²`, cost: 30 },
        { text: `Panel 1: ${s5_questions[0].value}, Panel 2: ${s5_questions[1].value}. Keep going!`, cost: 60 },
        { text: `Code: ${s5code}`, cost: 120 },
      ],
      successText: "The hatch flies open! Salt air rushes in and sunlight floods the hold!",
    },
    storyOutro: "You burst through the hatch onto the ocean surface, gasping fresh air. A rescue boat bobs nearby, and the crew cheers as you climb aboard — clutching a bag of gold coins! 🏴‍☠️",
  };

  return {
    id: "silver",
    tier: "silver",
    title: "The Pirate's Vault",
    subtitle: "Crack the codes and escape the sunken ship!",
    theme: "Pirate Adventure",
    emoji: "🏴‍☠️",
    color: "#C0C0C0",
    bgGradient: "linear-gradient(135deg, #0a1628 0%, #1a2d4a 50%, #0a1628 100%)",
    yearRange: "Years 3–5",
    description: "You're trapped in a sunken pirate ship! Crack 5 mathematical codes to unlock the vault, find the treasure, and escape before the ship sinks further.",
    storyIntro: "You were diving for shells when you spotted the wreck of the legendary pirate ship *The Golden Barnacle*. Curiosity got the better of you — you swam inside. Now the current has shifted and the entrance is blocked. A glowing map appears on the wall: **'Solve 5 puzzles to unlock the vault and find the escape hatch.'** The adventure begins!",
    storyOutro: "You surface into brilliant sunshine, a bag of gold coins in hand. The rescue boat crew can't believe their eyes. You solved every puzzle and escaped the Pirate's Vault! 🏆",
    stages: [stage1, stage2, stage3, stage4, stage5],
    generate: generateSilverRoom,
  };
}

export { generateSilverRoom };
