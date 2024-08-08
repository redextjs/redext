import React, { useContext } from 'react';
import Context from './Context';
import useContextSelector from './hooks/useContextSelector';
import useDispatcher from './hooks/useDispatcher';

import type { ContextValue } from './types';

const connect = (mapStateToProps, mapDispatchToProps) => Component => {
  return props => {
    const { dispatch }: ContextValue = useContext(Context);

    const memoState = useContextSelector(mapStateToProps, {
      isWithSyncExternalStore: false
    });

    const dispatcher = useDispatcher(mapDispatchToProps);

    return (
      <Component
        {...props}
        {...memoState}
        {...dispatcher}
        dispatch={dispatch}
      />
    )
  }
};

export default connect
