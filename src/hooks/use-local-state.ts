/* eslint-disable no-extra-semi */
import { useState, useEffect, useMemo } from 'react'
import { proxy, useSnapshot } from 'valtio'

const defaultFactory = () => ({}) as Record<string, any>
export default function useLocalState<T extends object = Record<string, any>>(
  factory?: () => T,
  windowDebugKey = '',
) {
  factory ??= defaultFactory as any
  const writeState = useMemo(() => proxy(factory!()), [])
  const readState = useSnapshot(writeState)
  if (windowDebugKey) {
    if (!('localState' in window)) {
      ;(window as any).localState = {}
    }

    ;(window as any).localState[windowDebugKey] = writeState
  }
  return [readState, writeState] as [T, T]
}
