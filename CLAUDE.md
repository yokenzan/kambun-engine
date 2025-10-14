# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeScript implementation of a Kambun (Classical Chinese) text converter that transforms annotated Classical Chinese text into Kakikudashi (書き下し文) format using a 2-pass algorithm.

## Build Commands

```bash
# Install dependencies
npm install

# Run tests
npm test

# Watch mode for tests
npm run test:watch

# Test coverage
npm run test:coverage

# Build (compile TypeScript)
npm run build

# Run development version
npm run dev
```

## Architecture: 2-Pass Algorithm

The core conversion uses a clean separation between reading order resolution and text generation:

### Pass 1: Reading Order Resolution (`ReadingOrderResolver`)

**Algorithm**: Dependency graph + topological sort (Kahn's algorithm)

1. **Build Dependencies** - Construct adjacency list representing "word A must be read before word B"
   - Kunten rules define dependencies (e.g., レ点 creates: next word → current word)
   - Starting points (一、上、甲) → ending points (二、三 etc.)
   - Combined kunten (一レ) have compound dependency rules

2. **Topological Sort** - Kahn's algorithm resolves reading order
   - Handles complex nested kunten structures
   - Detects cyclic dependencies
   - Maintains original order when no dependencies exist

3. **Output** - Array of `ReadingUnit` with index and reading phase (normal, saidoku first/second)

Key insight: Kunten are read instructions, not part of output. They create a dependency graph that determines reading order.

### Pass 2: Text Generation (`TextGenerator`)

Takes the ordered `ReadingUnit[]` and converts to final string:

- **Okiji (置き字)**: Skipped entirely (e.g., 於、于)
- **Saidoku (再読文字)**: Read twice with different forms (e.g., 未 → "ず" then "いまだ")
- **Joji/Jodoushi (助字・助動詞)**: Convert to furigana reading
- **Okurigana (送り仮名)**: Convert to hiragana
- **Normal characters**: Kanji + converted okurigana

### Main Convertor (`KakikudashiConvertor`)

Orchestrates the two passes:
```typescript
convert(words: Word[]): string {
  const readingOrder = this.resolver.resolve(words);  // Pass 1
  return this.generator.generate(words, readingOrder); // Pass 2
}
```

## Key Domain Concepts

**Kunten (訓点)**: Reading marks indicating Japanese reading order in Classical Chinese:
- `レ` (re) - Reversal mark (read next word first)
- `一二三四五` - Numeric sequence marks
- `上中下` - Positional marks
- `甲乙丙丁` - Stem marks
- `天地人` - Heaven/Earth/Person marks

Each Kunten has:
- `value`: The mark character
- `isStartingPoint`: true for 一、上、甲、天 (marks that initiate jumps)
- `jumpStrategy`: The pattern family it belongs to

**Combined Kunten**: Compound marks like 一レ, 上レ (combine jump and reversal)

**Reading order peculiarity**: In Kambun, ending points (二、三) appear **before** starting points (一) in the text but are read **after** them.

## Directory Structure

```
src/
├── domain/           # Core domain models
│   ├── types.ts      # JumpStrategy, ReadingPhase, ReadingUnit
│   ├── Kunten.ts     # Kunten marks (single and combined)
│   ├── Word.ts       # Base word interface
│   └── Character.ts  # Character implementations
├── parser/           # Input parsers
│   └── PhesocaNotationParser.ts
└── convertor/        # Core conversion logic
    ├── ReadingOrderResolver.ts  # Pass 1: Dependency resolution
    ├── TextGenerator.ts         # Pass 2: String generation
    └── KakikudashiConvertor.ts  # Main orchestrator
```

## Testing

Tests use Vitest with comprehensive coverage across:
- Basic kunten patterns (re-ten, ichi-ni-ten)
- Combined kunten (ichi-re-ten, jou-re-ten)
- Special characters (okiji, saidoku)
- Integration tests with Phesoca parser
- End-to-end conversion tests
