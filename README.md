# TypeScript Kambun Convertor

TypeScript implementation of a Kambun (Classical Chinese) converter. It parses annotated input text and converts it into kakikudashi (書き下し文) using a two-pass reading-order algorithm.

```ts
import { PhesocaNotationParser, KakikudashiConvertor } from 'typescript-kambun';

const parser = new PhesocaNotationParser();
const convertor = new KakikudashiConvertor();
const words = parser.parse('愛ス[レ]人ヲ')[0];

console.log(convertor.convert(words)); // 人を愛す
```

## Features

- Two-pass conversion: reading-order resolution followed by text generation.
- Kunten support for `レ`, numeric marks, positional marks, stem marks, and heaven/earth/person marks.
- Combined kunten notation such as `一レ`, `上レ`, `甲レ`, and `天レ`.
- Phesoca-style input for okurigana, furigana, compound words, joji, okiji, saidoku, and warichu.
- Vitest coverage for parser, convertor, and end-to-end behavior.

## Setup

```bash
npm install
```

## Commands

```bash
npm run build         # Compile TypeScript into dist/
npm test              # Run Vitest in interactive mode
npm run test:run      # Run the full test suite once
npm run test:watch    # Re-run tests while developing
npm run test:coverage # Generate coverage reports in coverage/
npm run dev           # Run src/index.ts with tsx
npm run docs          # Generate TypeDoc API docs in docs/
```

## Phesoca Notation

Write kanji and punctuation as plain text. Katakana immediately after a word is treated as okurigana and is converted to hiragana in output.

| Input | Output | Notes |
| --- | --- | --- |
| `山川` | `山川` | No marks: read in input order |
| `見ル` | `見る` | `ル` is okurigana |
| `春(はる)眠(ねむ)リ` | `春眠り` | Furigana is stored as reading metadata |

Kunten are written after a word in square brackets. `レ` means the next word is read first.

| Input | Output | Notes |
| --- | --- | --- |
| `愛ス[レ]人ヲ` | `人を愛す` | Read `人ヲ` before `愛ス` |
| `*将(まさ)ニ<ス>[レ]来タラムト。` | `将に来たらむとす。` | Saidoku with re-ten |

Supported single kunten are `[レ]`, `[一]`, `[二]`, `[三]`, `[四]`, `[五]`, `[上]`, `[中]`, `[下]`, `[甲]`, `[乙]`, `[丙]`, `[丁]`, `[天]`, `[地]`, and `[人]`. Supported combined kunten are `[一レ]`, `[上レ]`, `[甲レ]`, and `[天レ]`.

Furigana uses `(よみ)`. Compound words use ASCII apostrophes.

| Input | Output | Notes |
| --- | --- | --- |
| `春(はる)` | `春` | Attach reading metadata |
| `'春眠'(しゅんみん)` | `春眠` | Treat `春眠` as one compound word |
| `'春眠'(しゅんみん)、~不(ず)[レ]覚(おぼ)エ[レ]暁(あかつき)ヲ` | `春眠、暁を覚えず` | Compound word, joji, and re-ten |

Use `~` for joji or auxiliary words that should be read by furigana. Use `_` for okiji that should normally be skipped.

| Input | Output | Notes |
| --- | --- | --- |
| `~不(ず)` | `ず` | Joji uses furigana as output |
| `学ビテ_而時ニ` | `学びて時に` | `_而` is skipped |
| `_而(いた)リ{接続詞}` | `（接続詞）` | Warichu remains visible even on okiji |

Use `*` for saidoku. The second reading comes from furigana plus okurigana; the first reading is written with `<...>` or `«...»`.

| Input | Output | Notes |
| --- | --- | --- |
| `*将(まさ)ニ<ス>行カント。` | `将に行かんとす。` | `将` is read as `まさに` and later `す` |
| `*盍ゾ«ざル»[三]各〻言ハ[二]爾ノ志ヲ[一]。` | `盍ぞ各〻爾の志を言はざる。` | Guillemet notation also works |
| `*未(いま)ダ<ズ>{まだ...ない}[レ]知ラ。` | `未だ（まだ...ない）知らず。` | Saidoku with warichu and re-ten |

Use `{注釈}` for warichu. It renders as full-width parentheses after the word. Empty warichu `{}` renders as `（）`.

| Input | Output | Notes |
| --- | --- | --- |
| `山{高い山}川` | `山（高い山）川` | Attach an annotation to the previous word |
| `見ル{見ること}` | `見る（見ること）` | Works with okurigana |
| `'春眠'{春の眠り}(しゅんみん)` | `春眠（春の眠り）` | Works with compound words |

Input caveats:

- Newlines are ignored by the parser.
- Okurigana detection depends on katakana.
- Kunten are reading-order instructions, not output text.
- Escape syntax for literal `{}`, `[]`, `()`, `<>`, `«»`, and `'` is not defined.

## Architecture

The converter is split into two passes:

1. `ReadingOrderResolver` builds dependencies from kunten and resolves them with a topological sort.
2. `TextGenerator` renders the ordered reading units, handling okurigana, joji, okiji, saidoku, and warichu.

`KakikudashiConvertor` orchestrates both passes:

```ts
convert(words: Word[]): string {
  const readingOrder = this.resolver.resolve(words);
  return this.generator.generate(words, readingOrder);
}
```

For a detailed explanation of the dependency graph and topological sort, see [ALGORITHM.md](./ALGORITHM.md).

## Project Structure

```text
src/
├── domain/      # Core domain models and kunten definitions
├── parser/      # Phesoca notation parser
├── convertor/   # Reading-order resolution and text generation
└── index.ts     # Public exports

tests/
├── parser/
├── convertor/
└── integration/
```

Generated outputs are not edited by hand:

- `dist/`: TypeScript build output
- `docs/`: TypeDoc API documentation
- `coverage/`: test coverage reports
