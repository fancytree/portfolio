// Copied from the DEF ERP repository (web/src/lib/productUnitChain.ts). Keep in sync; do not edit the logic here.

/** Mirrors the zod-inferred type in productUnitChain.ts (zod is not a dependency here). */
export type UnitTier = { unit_zh: string; unit_it: string; ratio: number; parent_unit_zh?: string };
export type ProductUnitChain = { base_unit_zh: string; base_unit_it: string; tiers: UnitTier[] };

/** 自基础单位向上，每档的父级单位中文名 */
export function parentUnitZh(chain: ProductUnitChain, tierIndex: number): string {
  if (tierIndex <= 0) return chain.base_unit_zh;
  return chain.tiers[tierIndex]?.parent_unit_zh || chain.tiers[tierIndex - 1]?.unit_zh || chain.base_unit_zh;
}

/** 1 单位 = ? 个基础单位 */
export function factorToBase(chain: ProductUnitChain, unitZh: string): number {
  if (unitZh === chain.base_unit_zh) return 1;
  const tierIndex = chain.tiers.findIndex((tier) => tier.unit_zh === unitZh);
  if (tierIndex < 0) return 1;
  const tier = chain.tiers[tierIndex];
  return tier.ratio * factorToBase(chain, parentUnitZh(chain, tierIndex));
}
