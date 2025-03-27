import { useContext } from 'react';
import Context from '../Context';

import type { ContextValue } from '../types';

const useDispatcher = (mapDispatchToProps: any) => {
  const { dispatch, effects }: ContextValue<any> = useContext(Context);

  let filteredDispatch = {};

  if (mapDispatchToProps) {
    filteredDispatch = mapDispatchToProps(effects, dispatch)
  }

  return filteredDispatch
};

export default useDispatcher
