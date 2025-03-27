import React, { useContext, ComponentType } from 'react';
import Context from './Context';
import useContextSelector from './hooks/useContextSelector';
import useDispatcher from './hooks/useDispatcher';

import type { ContextValue } from './types';

const connect = <T extends unknown>(mapStateToProps: any, mapDispatchToProps: any) => (Component: ComponentType<T>): ComponentType<T> => {
  return (props: any) => {
    const { dispatch }: ContextValue<any> = useContext(Context);

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
