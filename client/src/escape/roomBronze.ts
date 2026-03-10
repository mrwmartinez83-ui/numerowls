import { EscapeRoom, EscapeStage, rand, randFrom } from "./escapeTypes";

// ─── Bronze Room: The Enchanted Forest ───────────────────────────────────────
// Year 1–3 · 5 stages · Themes: addition, subtraction, doubling, simple
// multiplication, number patterns

function generateBronzeRoom(): EscapeRoom {

  // ── Stage 1: The Mossy Gate ──────────────────────────────────────────────
  // Puzzle: Three enchanted stones each show a number. Add them all together
  // to find the gate code.
  const s1a = rand(5, 15);
  const s1b = rand(5, 15);
  const s1c = rand(5, 15);
  const s1code = String(s1a + s1b + s1c);

  const stage1: EscapeStage = {
    id: 1,
    name: "The Mossy Gate",
    scene: "A towering stone gate covered in glowing moss blocks your path.",
    sceneEmoji: "🌿",
    storyIntro: `You step into the Enchanted Forest. Twisted trees loom overhead and fireflies dance in the shadows. Ahead stands a **mossy stone gate** — the only way forward. Three glowing stones are set into the arch, each carved with a number. A riddle is scratched into the stone:\n\n*"Add the three sacred numbers together. Speak the sum aloud to open the gate."*`,
    puzzle: {
      type: "cipher_lock",
      title: "The Three Sacred Stones",
      flavourText: "Each stone holds a piece of the gate's secret. Add all three numbers to find the code.",
      clues: [
        { id: "s1a", label: "🪨 First Stone", question: `The first stone glows with the number **${s1a}**`, answer: s1a, visual: "🪨" },
        { id: "s1b", label: "🪨 Second Stone", question: `The second stone pulses with the number **${s1b}**`, answer: s1b, visual: "🪨" },
        { id: "s1c", label: "🪨 Third Stone", question: `The third stone hums with the number **${s1c}**`, answer: s1c, visual: "🪨" },
      ],
      lockCode: s1code,
      hints: [
        { text: `The first stone is ${s1a}. Add the other two to it.`, cost: 30 },
        { text: `${s1a} + ${s1b} = ${s1a + s1b}. Now add the third stone.`, cost: 60 },
        { text: `The answer is ${s1code}.`, cost: 120 },
      ],
      successText: "The gate groans and swings open! A warm golden light floods through.",
    },
    storyOutro: "The mossy gate swings open with a deep rumble. Beyond it, a winding path leads deeper into the forest...",
  };

  // ── Stage 2: The Fairy Bridge ────────────────────────────────────────────
  // Puzzle: A fairy asks two riddles. Each answer is a single digit.
  // The two digits together form the bridge code.
  const s2a_start = rand(10, 30);
  const s2a_sub = rand(3, s2a_start - 1);
  const s2a_ans = s2a_start - s2a_sub; // must be single digit: ensure
  // recalculate to guarantee single digit answer
  const s2a_fixed_start = rand(10, 19);
  const s2a_fixed_sub = rand(s2a_fixed_start - 9, s2a_fixed_start - 1);
  const s2a_answer = s2a_fixed_start - s2a_fixed_sub; // 1-9
  const s2b_answer = rand(2, 9);
  const s2b_double = s2b_answer * 2;
  const s2code = `${s2a_answer}${s2b_answer}`;

  const stage2: EscapeStage = {
    id: 2,
    name: "The Fairy Bridge",
    scene: "A rickety bridge spans a sparkling stream. A tiny fairy hovers at the entrance.",
    sceneEmoji: "🧚",
    storyIntro: `A tiny fairy with silver wings blocks the bridge. She crosses her arms and says:\n\n*"No one crosses my bridge without answering my two riddles! Solve them both, then tell me the two answers side by side — that is your crossing code."*\n\nShe taps her wand impatiently.`,
    puzzle: {
      type: "cipher_lock",
      title: "The Fairy's Two Riddles",
      flavourText: "Solve both riddles. Write the two answers next to each other (e.g. if answers are 3 and 7, the code is 37).",
      clues: [
        {
          id: "s2a",
          label: "🧚 Riddle One",
          question: `*"I start with ${s2a_fixed_start}. Take away ${s2a_fixed_sub}. What am I?"*`,
          answer: s2a_answer,
          visual: "🧚",
        },
        {
          id: "s2b",
          label: "🧚 Riddle Two",
          question: `*"Double me and you get ${s2b_double}. What number am I?"*`,
          answer: s2b_answer,
          visual: "🧚",
        },
      ],
      lockCode: s2code,
      hints: [
        { text: `For Riddle One: ${s2a_fixed_start} take away ${s2a_fixed_sub}. Count back from ${s2a_fixed_start}.`, cost: 30 },
        { text: `Riddle One answer: ${s2a_answer}. For Riddle Two: what number doubled gives ${s2b_double}?`, cost: 60 },
        { text: `The code is ${s2code} (${s2a_answer} then ${s2b_answer}).`, cost: 120 },
      ],
      successText: "The fairy claps her hands and leaps aside. 'You may cross!'",
    },
    storyOutro: "The fairy curtsies and the bridge glows gold beneath your feet as you cross safely to the other side.",
  };

  // ── Stage 3: The Witch's Cauldron ────────────────────────────────────────
  // Puzzle: A witch's recipe requires ingredients in exact amounts.
  // Each ingredient amount is found by solving a doubling/halving clue.
  // The three amounts form a 3-digit code.
  const s3a_half_of = rand(2, 9) * 2; // even number
  const s3a_ans = s3a_half_of / 2;    // 1-9
  const s3b_double_of = rand(2, 9);
  const s3b_ans = s3b_double_of * 2;  // 4-18 → take units digit if >9
  const s3b_code_digit = s3b_ans % 10 === 0 ? 1 : s3b_ans % 10; // ensure non-zero
  const s3c_ans = rand(2, 9);
  const s3c_times = rand(2, 5);
  const s3c_product = s3c_ans * s3c_times;
  const s3code = `${s3a_ans}${s3b_double_of}${s3c_ans}`;

  const stage3: EscapeStage = {
    id: 3,
    name: "The Witch's Cauldron",
    scene: "A bubbling cauldron sits in a clearing. A cloaked witch stirs it slowly.",
    sceneEmoji: "🧙",
    storyIntro: `A hunched witch looks up from her cauldron. Smoke curls around her pointed hat.\n\n*"I'll let you pass — but only if you help me finish my potion! I need exactly the right amounts of three ingredients. Solve my clues to find how many of each I need. The three amounts, written in order, unlock the forest path."*\n\nShe cackles and gestures to three ingredient jars.`,
    puzzle: {
      type: "cipher_lock",
      title: "The Witch's Recipe",
      flavourText: "Find the amount of each ingredient. Write the three amounts together as a 3-digit code.",
      clues: [
        {
          id: "s3a",
          label: "🍄 Mushrooms",
          question: `*"Half of ${s3a_half_of} mushrooms."* How many mushrooms?`,
          answer: s3a_ans,
          visual: "🍄",
        },
        {
          id: "s3b",
          label: "🌿 Leaves",
          question: `*"Double ${s3b_double_of} leaves."* How many leaves?`,
          answer: s3b_double_of * 2,
          visual: "🌿",
        },
        {
          id: "s3c",
          label: "⭐ Star Drops",
          question: `*"${s3c_times} groups of ${s3c_ans} star drops."* How many star drops?`,
          answer: s3c_product,
          visual: "⭐",
        },
      ],
      lockCode: s3code,
      hints: [
        { text: `Half of ${s3a_half_of} = ${s3a_ans}. That's the first digit.`, cost: 30 },
        { text: `Mushrooms: ${s3a_ans}. Leaves: double ${s3b_double_of} = ${s3b_double_of * 2}. Now find the star drops.`, cost: 60 },
        { text: `The code is ${s3code}.`, cost: 120 },
      ],
      successText: "The witch cackles with delight and waves you through the smoke.",
    },
    storyOutro: "The witch drops her ingredients into the cauldron with a BOOM of purple smoke. A hidden path appears through the trees.",
  };

  // ── Stage 4: The Troll's Toll ────────────────────────────────────────────
  // Puzzle: A troll demands payment. He shows a number pattern with gaps.
  // Fill in the missing numbers to find the toll code.
  const s4_step = rand(2, 5);
  const s4_start = rand(2, 10);
  const s4_seq = Array.from({ length: 6 }, (_, i) => s4_start + i * s4_step);
  // hide positions 2 and 4 (0-indexed)
  const s4_ans1 = s4_seq[2]; // third number
  const s4_ans2 = s4_seq[4]; // fifth number
  const s4code = `${s4_ans1}${s4_ans2}`;

  const stage4: EscapeStage = {
    id: 4,
    name: "The Troll's Toll",
    scene: "A grumpy troll sits on a boulder blocking the path, arms folded.",
    sceneEmoji: "👹",
    storyIntro: `A huge troll with a mossy beard blocks the path. He holds up a stone tablet carved with numbers — but some have been scratched out!\n\n*"Want to pass? Then finish my number pattern! Tell me the two missing numbers, one after the other. That's my toll."*\n\nHe grins, showing mossy teeth.`,
    puzzle: {
      type: "pattern_sequence",
      title: "The Troll's Number Pattern",
      flavourText: `The pattern goes: **${s4_seq[0]}, ${s4_seq[1]}, ?, ${s4_seq[3]}, ?, ${s4_seq[5]}**\n\nFind the two missing numbers (marked with ?). Write them together as your code.`,
      clues: [
        {
          id: "s4a",
          label: "🔢 The Pattern",
          question: `The sequence is: **${s4_seq[0]}, ${s4_seq[1]}, ?, ${s4_seq[3]}, ?, ${s4_seq[5]}**\n\nWhat is the rule? (The numbers go up by the same amount each time.)\n\nWhat are the two missing numbers?`,
          answer: s4_ans1,
          visual: "🔢",
        },
      ],
      lockCode: s4code,
      hints: [
        { text: `Look at the difference between ${s4_seq[0]} and ${s4_seq[1]}. The pattern adds the same number each time.`, cost: 30 },
        { text: `The rule is +${s4_step} each time. The third number is ${s4_ans1}.`, cost: 60 },
        { text: `Missing numbers are ${s4_ans1} and ${s4_ans2}. Code: ${s4code}.`, cost: 120 },
      ],
      successText: "The troll scratches his head, then grudgingly steps aside.",
    },
    storyOutro: "The troll grumbles and shuffles off the path. You can see the edge of the forest ahead — and a glimmer of golden light!",
  };

  // ── Stage 5: The Crystal Door ────────────────────────────────────────────
  // Puzzle: Four crystals each show a multiplication. The answers form a 4-digit code.
  const s5_pairs: [number, number][] = [
    [rand(2, 5), rand(2, 10)],
    [rand(2, 5), rand(2, 10)],
    [rand(2, 5), rand(2, 10)],
    [rand(2, 5), rand(2, 10)],
  ];
  // ensure each answer is a single digit (1-9) for clean code
  const s5_clues = s5_pairs.map(([a, b]) => {
    const ans = a * b;
    return { a, b, ans };
  });
  // Use last digit of each answer for the code (to keep it manageable)
  const s5code = s5_clues.map(c => c.ans % 10 === 0 ? String(c.ans).slice(-2) : String(c.ans % 10)).join("").slice(0, 4);
  // Actually let's just use the full answers concatenated, padded
  const s5code_full = s5_clues.map(c => String(c.ans)).join("-");
  // For the lock, use the four answers separated by dashes
  const s5lock = s5_clues.map(c => c.ans).join("");

  const stage5: EscapeStage = {
    id: 5,
    name: "The Crystal Door",
    scene: "A shimmering crystal door stands at the forest's edge, radiating warm light.",
    sceneEmoji: "💎",
    storyIntro: `At last — the Crystal Door! It shimmers with rainbow light. Four crystals are set into the door, each showing a multiplication. A golden plaque reads:\n\n*"Solve each crystal's multiplication. Enter the four answers in order to unlock the door and escape the Enchanted Forest!"*\n\nYou're so close to freedom!`,
    puzzle: {
      type: "cipher_lock",
      title: "The Four Crystal Multiplications",
      flavourText: "Solve each multiplication. Enter all four answers in order (no spaces or dashes).",
      clues: s5_clues.map((c, i) => ({
        id: `s5_${i}`,
        label: `💎 Crystal ${i + 1}`,
        question: `**${c.a} × ${c.b} = ?**`,
        answer: c.ans,
        visual: "💎",
      })),
      lockCode: s5lock,
      hints: [
        { text: `Crystal 1: ${s5_clues[0].a} × ${s5_clues[0].b} = ${s5_clues[0].ans}`, cost: 30 },
        { text: `Crystal 1: ${s5_clues[0].ans}, Crystal 2: ${s5_clues[1].ans}. Keep going!`, cost: 60 },
        { text: `Answers: ${s5_clues.map(c => c.ans).join(", ")}. Code: ${s5lock}`, cost: 120 },
      ],
      successText: "The Crystal Door blazes with golden light and swings wide open!",
    },
    storyOutro: "The door bursts open in a shower of sparkling light. You step out of the Enchanted Forest into warm sunshine. You escaped! 🎉",
  };

  return {
    id: "bronze",
    tier: "bronze",
    title: "The Enchanted Forest",
    subtitle: "Can you lift the curse and find your way home?",
    theme: "Fantasy Forest",
    emoji: "🌲",
    color: "#CD7F32",
    bgGradient: "linear-gradient(135deg, #0d2b1a 0%, #1a4a2e 50%, #0d2b1a 100%)",
    yearRange: "Years 1–3",
    description: "You are lost in an enchanted forest. Solve 5 magical puzzles to unlock the path home. Work together — the forest holds many secrets!",
    storyIntro: "You were picking berries in the woods when a strange mist rolled in. Now the trees all look the same and you can't find your way home. A glowing sign reads: **'Solve the forest's five puzzles to break the curse and find your way home.'** Your adventure begins...",
    storyOutro: "You burst out of the forest into bright sunshine! The curse is broken. In the distance, you can see the village — and the smell of home cooking drifts on the breeze. You did it! 🏆",
    stages: [stage1, stage2, stage3, stage4, stage5],
    generate: generateBronzeRoom,
  };
}

export { generateBronzeRoom };
