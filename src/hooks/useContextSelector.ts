import { useContext, useSyncExternalStore } from 'react';
import Context from '../Context';
import useDeepMemo from './useDeepMemo';

import type { ContextSelectorParams, ContextValue } from '../types';

const useContextSelector = (mapStateToProps: any, params: ContextSelectorParams = {}) => {
  const { isWithSyncExternalStore = true } = params;

  if (isWithSyncExternalStore && useSyncExternalStore) {
    const { subscribe, getState }: ContextValue<any> = useContext(Context);
    const getSnapshot = () => {
      if (!mapStateToProps) {
        return undefined
      }

      const state = getState();

      return mapStateToProps(state);
    };

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  }

  const { state = {} }: ContextValue<any> = useContext(Context);

  let filteredState = {};

  if (mapStateToProps) {
    filteredState = mapStateToProps(state);
  } else {
    filteredState = state
  }

  return useDeepMemo(() => {
    return filteredState
  }, [filteredState])
};

export default useContextSelector
