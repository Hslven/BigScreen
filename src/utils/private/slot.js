export function slot (vm, slotName, otherwise) {
  return vm.$scopedSlots[slotName] !== undefined
    ? vm.$scopedSlots[slotName]()
    : otherwise
}

export function uniqueSlot (vm, slotName, otherwise) {
  return vm.$scopedSlots[slotName] !== undefined
    ? [].concat(vm.$scopedSlots[slotName]())
    : otherwise
}

/**
 * Source definitely exists,
 * so it's merged with the possible slot
 */
export function mergeSlot (source, vm, slotName) {
  return vm.$scopedSlots[slotName] !== undefined
    ? source.concat(vm.$scopedSlots[slotName]())
    : source
}

/**
 * Merge with possible slot,
 * even if source might not exist
 */
export function mergeSlotSafely (source, vm, slotName) {
  if (vm.$scopedSlots[slotName] === undefined) {
    return source
  }

  const slot = vm.$scopedSlots[slotName]()
  return source !== undefined
    ? source.concat(slot)
    : slot
}
