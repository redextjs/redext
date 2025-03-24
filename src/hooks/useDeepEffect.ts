import React from 'react';
import useDeepMemoize from './useDeepMemoize';
import checkDeps from '../utils/checkDeps';

const useDeepEffect = (effect: any, dependencies: any) => {
  if (process.env.NODE_ENV !== 'production') {
    checkDeps(dependencies, 'useDeepEffect');
  }

  return React.useEffect(effect, useDeepMemoize(dependencies));
};

export default useDeepEffect;
