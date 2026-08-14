/** 是否为金额/数字类输入（滚轮聚焦时易误改） */
function isWheelSensitiveInput(el: HTMLInputElement): boolean {
  if (el.type === 'number') return true;
  if (el.inputMode === 'decimal' || el.inputMode === 'numeric') return true;
  return false;
}

/** 全局：金额/数字输入聚焦时滚轮改为失焦，避免误改数值 */
export function installDisableAmountInputWheel(): () => void {
  function onWheel(event: WheelEvent) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (document.activeElement !== target) return;
    if (!isWheelSensitiveInput(target)) return;
    target.blur();
  }

  document.addEventListener('wheel', onWheel, { capture: true, passive: true });
  return () => document.removeEventListener('wheel', onWheel, { capture: true });
}

/** 供 Input 组件复用（与全局逻辑一致） */
export function blurAmountInputOnWheel(
  event: { currentTarget: HTMLInputElement },
) {
  const el = event.currentTarget;
  if (!isWheelSensitiveInput(el)) return;
  el.blur();
}
