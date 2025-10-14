/**
 * 訓点のジャンプ戦略
 * 読み順を決定するための返り点のパターン
 */
export enum JumpStrategy {
  RE = "レ",
  ICHI_NI_SAN = "一二三",
  JOU_CHU_GE = "上中下",
  KOU_OTSU_HEI_TEI = "甲乙丙丁",
  TEN_CHI_JIN = "天地人",
}

/**
 * 読みのフェーズ
 * 通常の読みと再読文字の1回目/2回目を区別
 */
export enum ReadingPhase {
  NORMAL = "NORMAL",
  SAIDOKU_FIRST = "SAIDOKU_FIRST",
  SAIDOKU_SECOND = "SAIDOKU_SECOND",
}

/**
 * 読み順の単位
 */
export interface ReadingUnit {
  /** 単語のインデックス */
  index: number;
  /** 読みのフェーズ */
  phase: ReadingPhase;
}
