import type { InitConfig, Action, ModelDispatchers, Model, Plugin } from './types';

type Models = Record<string, Model>;

type Dispatch = (action: Action) => void;

type EffectFunction = (...args: any[]) => any;

type Effects = Record<string, EffectFunction>;

type Store = {
  getState: (initialState?: Record<string, any>) => Record<string, any>;
  getReducer: (state?: Record<string, any>, action?: Action) => Record<string, any>;
  getEffect: (dispatch: Dispatch, state?: Record<string, any>) => {
    effects: Record<string, Effects>;
    models: Models;
    dispatch: Dispatch;
    on: (eventName: string, callback: (pluginEvent: any) => void) => void;
  };
};

function merge<T>(original: T, extra?: Partial<T>): T {
  return extra ? { ...extra, ...original } : original;
}

export default function createStore(config: InitConfig): Store {
  const { plugins = [] } = config;

  plugins.forEach((plugin: Plugin) => {
    if (plugin.config) {
      config.models = merge(config.models, plugin.config.models);
    }
  });

  const on = (eventName: string, callback: (pluginEvent: any) => void): void => {
    plugins.forEach((plugin: Plugin) => {
      if (plugin[eventName]) {
        callback(plugin[eventName]);
      }
    });
  };

  const { models = {} } = config;

  const getState = (initialState: Record<string, any> = {}): Record<string, any> => {
    const newInitialState: Record<string, any> = {};

    Object.keys(models).forEach((modelFilename) => {
      const model = models[modelFilename] || {};
      const modelName = model.name || modelFilename;
      newInitialState[modelName] = Object.assign({}, model.state, initialState[modelName])
    });

    return newInitialState;
  };

  const getReducer = (state: Record<string, any> = {}, action: Action = {} as Action): Record<string, any> => {
    const newState: Record<string, any> = {};

    Object.keys(models).forEach((modelFilename) => {
      const model = models[modelFilename] || {};
      const { reducers = {}, name: modelName = modelFilename } = model;
      let reducerState = state[modelName];
      const actionType = action.type.replace(`${modelName}/`, '');

      if (actionType in reducers) {
        reducerState = reducers[actionType](reducerState, action.payload, action.params);
      }

      newState[modelName] = reducerState;
    });

    return newState;
  };

  const getEffect = (dispatch: Dispatch, state: Record<string, any> = {}) => {
    const newEffects: Record<string, Effects> = {};

    Object.keys(models).forEach((modelFilename) => {
      const modelDispatcher: ModelDispatchers = {} as ModelDispatchers;
      const model: Model = models[modelFilename] || {};
      const { reducers = {}, effects: effectsFromConfig, name: modelName = modelFilename } = model;

      modelDispatcher.state = state[modelName];

      const onModelListener = ({ actionName }: { actionName: string }) => {
        on('onModel', (onModel) => {
          onModel({
            model: { ...model, name: modelName },
            modelName,
            actionName,
            dispatch,
          });
        });
      };

      Object.keys(reducers).forEach((actionName) => {
        const type = `${modelName}/${actionName}`;
        modelDispatcher[actionName] = (payload: any, params?: any) => {
          dispatch({ type, payload, params });
        };
      });

      let effects: any;
      dispatch[modelName] = modelDispatcher;

      if (typeof effectsFromConfig === 'function') {
        effects = effectsFromConfig(dispatch);
      } else {
        effects = effectsFromConfig || {};
      }

      const effectObj: Effects = {};

      Object.keys(effects).forEach((effectName) => {
        const effectFunc: EffectFunction = (...args) => {
          onModelListener({ actionName: effectName });
          return effects[effectName].apply(modelDispatcher, args);
        };

        modelDispatcher[effectName] = effectFunc;
        effectObj[effectName] = effectFunc;
      });

      newEffects[modelName] = effectObj;
    });

    return { effects: newEffects, models, dispatch, on };
  };

  return { getState, getReducer, getEffect };
}
