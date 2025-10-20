import { JumpStrategy } from "./types.js";

/**
 * 訓点のインターフェース
 */
export interface KuntenInterface {
  toString(): string;
}

/**
 * 単一の訓点
 */
export class Kunten implements KuntenInterface {
  constructor(
    public readonly value: string,
    public readonly isStartingPoint: boolean,
    public readonly jumpStrategy: JumpStrategy,
  ) {}

  toString(): string {
    return this.value;
  }

  // 訓点の定義
  static readonly RE = new Kunten("レ", false, JumpStrategy.RE);
  static readonly ICHI = new Kunten("一", true, JumpStrategy.ICHI_NI_SAN);
  static readonly NI = new Kunten("二", false, JumpStrategy.ICHI_NI_SAN);
  static readonly SAN = new Kunten("三", false, JumpStrategy.ICHI_NI_SAN);
  static readonly SHI = new Kunten("四", false, JumpStrategy.ICHI_NI_SAN);
  static readonly GO = new Kunten("五", false, JumpStrategy.ICHI_NI_SAN);
  static readonly JOU = new Kunten("上", true, JumpStrategy.JOU_CHU_GE);
  static readonly CHU = new Kunten("中", false, JumpStrategy.JOU_CHU_GE);
  static readonly GE = new Kunten("下", false, JumpStrategy.JOU_CHU_GE);
  static readonly KOU = new Kunten("甲", true, JumpStrategy.KOU_OTSU_HEI_TEI);
  static readonly OTSU = new Kunten("乙", false, JumpStrategy.KOU_OTSU_HEI_TEI);
  static readonly HEI = new Kunten("丙", false, JumpStrategy.KOU_OTSU_HEI_TEI);
  static readonly TEI = new Kunten("丁", false, JumpStrategy.KOU_OTSU_HEI_TEI);
  static readonly TEN = new Kunten("天", true, JumpStrategy.TEN_CHI_JIN);
  static readonly CHI = new Kunten("地", false, JumpStrategy.TEN_CHI_JIN);
  static readonly JIN = new Kunten("人", false, JumpStrategy.TEN_CHI_JIN);

  private static readonly KUNTEN_MAP: Map<string, Kunten> = new Map([
    ["レ", Kunten.RE],
    ["一", Kunten.ICHI],
    ["二", Kunten.NI],
    ["三", Kunten.SAN],
    ["四", Kunten.SHI],
    ["五", Kunten.GO],
    ["上", Kunten.JOU],
    ["中", Kunten.CHU],
    ["下", Kunten.GE],
    ["甲", Kunten.KOU],
    ["乙", Kunten.OTSU],
    ["丙", Kunten.HEI],
    ["丁", Kunten.TEI],
    ["天", Kunten.TEN],
    ["地", Kunten.CHI],
    ["人", Kunten.JIN],
  ]);

  /**
   * 文字列から訓点を取得
   */
  static fromString(value: string): Kunten | undefined {
    return this.KUNTEN_MAP.get(value);
  }
}

/**
 * 複合訓点（一レ点、上レ点など）
 */
export class CombinedKunten implements KuntenInterface {
  constructor(public readonly kuntens: Kunten[]) {
    if (kuntens.length === 0) {
      throw new Error("CombinedKunten must have at least one kunten");
    }
  }

  get primaryKunten(): Kunten {
    return this.kuntens[0];
  }

  get secondaryKunten(): Kunten | undefined {
    return this.kuntens[1];
  }

  get isStartingPoint(): boolean {
    return this.primaryKunten.isStartingPoint;
  }

  get jumpStrategy(): JumpStrategy {
    return this.primaryKunten.jumpStrategy;
  }

  toString(): string {
    return this.kuntens.map((k) => k.value).join("");
  }

  // 複合訓点の定義
  static readonly ICHI_RE = new CombinedKunten([Kunten.ICHI, Kunten.RE]);
  static readonly JOU_RE = new CombinedKunten([Kunten.JOU, Kunten.RE]);
  static readonly KOU_RE = new CombinedKunten([Kunten.KOU, Kunten.RE]);
  static readonly TEN_RE = new CombinedKunten([Kunten.TEN, Kunten.RE]);

  private static readonly COMBINED_KUNTEN_MAP: Map<string, CombinedKunten> =
    new Map([
      ["一レ", CombinedKunten.ICHI_RE],
      ["上レ", CombinedKunten.JOU_RE],
      ["甲レ", CombinedKunten.KOU_RE],
      ["天レ", CombinedKunten.TEN_RE],
    ]);

  /**
   * 文字列から複合訓点を取得
   */
  static fromString(value: string): CombinedKunten | undefined {
    return this.COMBINED_KUNTEN_MAP.get(value);
  }
}

/**
 * 文字列から訓点（単一または複合）を取得
 */
export function kuntenFromString(value: string): KuntenInterface | undefined {
  // まず複合訓点を試す
  const combined = CombinedKunten.fromString(value);
  if (combined) return combined;

  // 次に単一訓点を試す
  return Kunten.fromString(value);
}
