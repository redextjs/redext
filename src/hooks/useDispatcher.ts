import { useContext } from 'react';
import Context from '../Context';

import type { ContextValue } from '../types';

const useDispatcher = (mapDispatchToProps) => {
  const { dispatch, effects }: ContextValue = useContext(Context);

  let filteredDispatch = {};

  if (mapDispatchToProps) {
    filteredDispatch = mapDispatchToProps(effects, dispatch)
  }

  return filteredDispatch
};

export default useDispatcher
