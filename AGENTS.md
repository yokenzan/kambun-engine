# Repository Guidelines

## Project Structure & Module Organization

This is a TypeScript ESM library for converting annotated Kambun text to kakikudashi output. Source code lives in `src/`:

- `src/domain/`: core domain models such as `Character`, `Word`, `Kunten`, `ReadingUnit`, and `JumpStrategy`.
- `src/parser/`: Phesoca notation parsing.
- `src/convertor/`: reading-order resolution and output generation.
- `src/index.ts`: public exports.

Tests live in `tests/`, grouped by behavior: `tests/parser/`, `tests/convertor/`, and `tests/integration/`. Generated outputs are `dist/`, `docs/`, and `coverage/`; do not edit them by hand.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run build`: compile TypeScript with `tsc` into `dist/`.
- `npm test`: run Vitest in interactive mode.
- `npm run test:run`: run the full test suite once.
- `npm run test:watch`: rerun tests during development.
- `npm run test:coverage`: generate V8 coverage reports in `coverage/`.
- `npm run dev`: run `src/index.ts` through `tsx`.
- `npm run docs`: generate TypeDoc API docs in `docs/`.

## Architecture Notes

Conversion uses a two-pass design.

1. `ReadingOrderResolver` builds dependencies from kunten and resolves reading order with Kahn's topological sort.
2. `TextGenerator` renders ordered reading units, handling okurigana, joji, okiji, saidoku, and warichu.

Kunten are instructions, not output text. For example, `レ` creates a dependency that reads the next word before the marked word. Numeric, positional, stem, and heaven/earth/person marks define jump families. Combined kunten such as `一レ` and `上レ` combine jump and reversal behavior.

Use [README.md](./README.md) for the current user-facing Phesoca notation guide. Use [ALGORITHM.md](./ALGORITHM.md) for the detailed reading-order algorithm explanation.

## Coding Style & Naming Conventions

Use strict TypeScript and ES modules. Prefer explicit domain types over loose objects, and keep parsing, reading-order resolution, and text generation responsibilities separated. Match the existing style: two-space indentation, semicolons, single quotes, and named exports where practical. Class and type names use `PascalCase`; variables, functions, and test cases use `camelCase`. Preserve established spelling in existing APIs such as `convertor`.

## Testing Guidelines

Vitest is the test framework with global test APIs and the Node environment. Name test files `*.test.ts` and place them under the matching behavior directory. Add focused unit tests for parser and convertor changes, plus integration tests when public conversion behavior changes. Run `npm run test:run` before opening a PR; use `npm run test:coverage` for broader changes.

## Commit & Pull Request Guidelines

Recent history uses short imperative commits and conventional prefixes such as `feat:`, `fix:`, `test:`, and `chore:`. Keep commits scoped, for example `fix: handle saidoku reading order`.

Pull requests should include a concise description, affected parser or convertor behavior, tests run, and links to related issues. Include before/after examples for output changes and update `README.md` or `ALGORITHM.md` when notation, conversion behavior, or reading-order rules change.

## Agent-Specific Instructions

Do not modify generated `dist/`, `docs/`, or `coverage/` unless explicitly requested. When changing conversion logic, read `ALGORITHM.md` first and add tests that capture the notation rule being changed. Keep root Markdown limited to `README.md`, `AGENTS.md`, and `ALGORITHM.md`.
