# 割注 (Warichu) Implementation

## Overview

This document describes the implementation of 割注 (warichu) support in the TypeScript Kambun converter. 割注 is a type of annotation in Classical Chinese texts where explanatory or supplementary text is inserted between lines or in the margins.

## Implementation Details

### 1. Domain Model Extensions

#### Word Interface (`src/domain/Word.ts`)
- Added `warichu?: string` property to the `Word` interface
- This allows any word to have an optional warichu annotation

#### Character Class (`src/domain/Character.ts`)
- Extended `Character` constructor to accept `warichu` parameter
- Extended `CompoundCharacter` constructor to accept `warichu` parameter

### 2. Parser Extensions

#### PhesocaNotationParser (`src/parser/PhesocaNotationParser.ts`)
- Added support for `{注釈}` syntax for warichu annotations
- Added `WARICHU_TAG_OPEN = '{'` and `WARICHU_TAG_CLOSE = '}'` constants
- Extended `ParseContext` class with `whileWarichu` state
- Extended `WordParameter` class with `warichu` array and `hasWarichu` flag
- Updated parsing logic to handle warichu tags
- Updated `buildSentence` method to process warichu data

### 3. Text Generator Extensions

#### TextGenerator (`src/convertor/TextGenerator.ts`)
- Updated `normalReading` method to append warichu in parentheses format: `（注釈）`
- Updated `saidokuFirstReading` and `saidokuSecondReading` methods to handle warichu
- Updated okiji (置き字) handling to show warichu even when the character is skipped

### 4. Test Coverage

#### Parser Tests (`tests/parser/warichu-parser.test.ts`)
- Basic warichu parsing
- Compound character with warichu
- Okurigana with warichu
- Furigana with warichu
- Kunten with warichu
- Multiple warichu annotations
- Empty warichu annotations

#### Convertor Tests (`tests/convertor/warichu-convertor.test.ts`)
- Basic warichu conversion
- Okurigana with warichu
- Furigana with warichu
- Joji with warichu
- Multiple warichu annotations
- Characters without warichu
- Empty warichu annotations

#### Integration Tests (`tests/integration/warichu-integration.test.ts`)
- End-to-end parsing and conversion
- Complex combinations with other features
- Re-ten (レ点) with warichu
- Okiji (置き字) with warichu
- Saidoku (再読文字) with warichu

## Usage Examples

### Basic Syntax
```
山{高い山}川
```
Output: `山（高い山）川`

### With Furigana
```
春(はる){春の季節}
```
Output: `春（春の季節）`

### With Okurigana
```
見ル{見ること}
```
Output: `見る（見ること）`

### With Kunten
```
愛ス[レ]人ヲ{人を愛すること}
```
Output: `人を（人を愛すること）愛す`

### With Compound Characters
```
'春眠'{春の眠り}(しゅんみん)
```
Output: `春眠（春の眠り）`

### With Joji
```
~不(ず){否定の助字}
```
Output: `ず（否定の助字）`

### With Okiji
```
_而(いた)リ{接続詞}
```
Output: `（接続詞）`

### With Saidoku
```
*未(いまだ){まだ...ない}
```
Output: `いまだいまだ（まだ...ない）`

## Technical Notes

1. **Empty Warichu**: Empty warichu `{}` is supported and renders as `（）`
2. **Warichu Positioning**: Warichu is always appended to the word it follows in the input
3. **Integration**: Warichu works seamlessly with all existing features (kunten, furigana, okurigana, etc.)
4. **Performance**: Minimal impact on parsing and conversion performance

## Files Modified

- `src/domain/Word.ts` - Added warichu property to Word interface
- `src/domain/Character.ts` - Extended Character and CompoundCharacter classes
- `src/parser/PhesocaNotationParser.ts` - Added warichu parsing support
- `src/convertor/TextGenerator.ts` - Added warichu rendering support
- `tests/parser/warichu-parser.test.ts` - Parser tests (new)
- `tests/convertor/warichu-convertor.test.ts` - Convertor tests (new)
- `tests/integration/warichu-integration.test.ts` - Integration tests (new)

## Test Results

All 23 warichu-related tests pass successfully:
- 7 parser tests
- 7 convertor tests  
- 9 integration tests

The implementation is complete and ready for use.
