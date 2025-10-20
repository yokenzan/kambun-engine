import { ReadingOrderResolver } from './src/convertor/ReadingOrderResolver.js';
import { KakikudashiConvertor } from './src/convertor/KakikudashiConvertor.js';
import { Character } from './src/domain/Character.js';
import { Kunten } from './src/domain/Kunten.js';

console.log('=== レ点テストケースのデバッグ ===\n');

// テストケース1: 複数のレ点
console.log('【ケース1】複数のレ点: 不[レ]見[レ]山ヲ');
const case1 = [
  new Character('不', Kunten.RE),
  new Character('見', Kunten.RE),
  new Character('山', undefined, 'ヲ'),
];

const resolver = new ReadingOrderResolver();
const convertor = new KakikudashiConvertor();

const order1 = resolver.resolve(case1);
console.log('読み順:', order1);
console.log('期待値: [{ index: 1, phase: NORMAL }, { index: 0, phase: NORMAL }, { index: 2, phase: NORMAL }]');
console.log('実際の値:', JSON.stringify(order1, null, 2));

try {
  const result1 = convertor.convert(case1);
  console.log('変換結果:', result1);
  console.log('期待される変換結果: 山を見不');
} catch (e: any) {
  console.log('エラー:', e.message);
}

console.log('\n---\n');

// テストケース2: 基本的なレ点
console.log('【ケース2】基本的なレ点: 不[レ]見');
const case2 = [
  new Character('不', Kunten.RE),
  new Character('見'),
];

const order2 = resolver.resolve(case2);
console.log('読み順:', order2);

try {
  const result2 = convertor.convert(case2);
  console.log('変換結果:', result2);
  console.log('期待される変換結果: 見不');
} catch (e: any) {
  console.log('エラー:', e.message);
}

console.log('\n---\n');

// テストケース3: 一二点
console.log('【ケース3】一二点: 登ル山[二]ニ水[一]ヲ');
const case3 = [
  new Character('登', undefined, 'ル'),
  new Character('山', Kunten.NI, 'ニ'),
  new Character('水', Kunten.ICHI, 'ヲ'),
];

const order3 = resolver.resolve(case3);
console.log('読み順:', order3);
console.log('期待値: [{ index: 2 }, { index: 1 }, { index: 0 }]');
console.log('実際の値:', JSON.stringify(order3, null, 2));
