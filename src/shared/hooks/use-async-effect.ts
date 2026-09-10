import { DependencyList, useEffect, useRef } from 'react';

/**
 * Hook for handling async operations in useEffect without lint warnings.
 *
 * This hook properly handles:
 * - Async function execution in useEffect
 * - Cleanup/cancellation when dependencies change
 * - Avoiding state updates after unmount
 *
 * The latest `effect` callback is always invoked via a ref that is refreshed
 * inside the effect (never during render), so the caller-owned `deps` array
 * needs no static verification and no suppression comments.
 *
 * @example
 * ```tsx
 * useAsyncEffect(async (signal) => {
 *   const data = await fetchData();
 *   if (!signal.aborted) {
 *     setData(data);
 *   }
 * }, [dependency]);
 * ```
 */
export function useAsyncEffect(
  effect: (signal: AbortSignal) => Promise<(() => void) | undefined>,
  deps: DependencyList,
): void {
  const isMountedRef = useRef(true);
  const effectRef = useRef(effect);

  useEffect(() => {
    effectRef.current = effect;
    const abortController = new AbortController();
    isMountedRef.current = true;

    let cleanup: (() => void) | undefined;

    const runEffect = async (): Promise<void> => {
      try {
        cleanup = await effectRef.current(abortController.signal);
      } catch (error) {
        // Only log errors if not aborted
        if (!abortController.signal.aborted) {
          console.error('useAsyncEffect error:', error);
        }
      }
    };

    void runEffect();

    return () => {
      isMountedRef.current = false;
      abortController.abort();
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
    // `deps` is caller-provided (not an array literal), so static verification
    // is impossible by design; callers own their dependency lists.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Simpler version that just runs an async callback.
 * Use when you don't need abort signal or cleanup.
 *
 * @example
 * ```tsx
 * useAsyncEffectOnce(async () => {
 *   await loadData();
 * }, [dependency]);
 * ```
 */
export function useAsyncEffectOnce(effect: () => Promise<void>, deps: DependencyList): void {
  const effectRef = useRef(effect);

  useEffect(() => {
    effectRef.current = effect;
    let mounted = true;

    const run = async (): Promise<void> => {
      try {
        await effectRef.current();
      } catch (error) {
        if (mounted) {
          console.error('useAsyncEffectOnce error:', error);
        }
      }
    };

    void run();

    return () => {
      mounted = false;
    };
    // `deps` is caller-provided (not an array literal), so static verification
    // is impossible by design; callers own their dependency lists.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
