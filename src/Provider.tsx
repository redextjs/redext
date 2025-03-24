import React, { useReducer, useRef } from 'react';
import type { Action } from './types';
import Context from './Context';

type Listener = () => void;

const Provider = (props: any) => {
  const { store, ...providerProps } = props;

  if (!store) {
    throw new Error('Please use <Provider store={...} initialValue={...}>');
  }

  const listeners = new Set<Listener>();

  const initialState = store.getState(props.initialValue);

  const [state, dispatch] = useReducer(store.getReducer, initialState);

  const stateRef = useRef(initialState);

  stateRef.current = state;

  const getState = () => {
    return stateRef.current;
  };

  const { effects, dispatch: dispatcher, models, on } = store.getEffect(dispatch, state);

  const subscribe = (listener: Listener) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener)
    }
  }

  const value = {
    subscribe,
    getState,
    state: getState(),
    dispatch: (arg: Action) => {
      on('onModel', (onModel: any) => {
        const type = arg?.type;
        const types = type.split('/');
        const modelName = types[0];
        const actionName = types[1];
        const model = models[modelName];

        onModel({
          model: {
            ...model,
            name: modelName
          },
          modelName,
          actionName,
          dispatch: dispatcher
        })
      });

      dispatcher(arg);

      listeners.forEach((listener: any) => listener());
    },
    effects
  };

  return (
    <Context.Provider
      value={value}
      {...providerProps}
    />
  );
};

export default Provider
