import type {
  Store,
  InitConfig,
  Action,
  ModelDispatchers,
  Model,
  Plugin,
  Models,
  ModelEffects
} from './types';

type EffectFunction = (...args: any[]) => any;

type Effects = Record<string, EffectFunction>;

const merge = <T>(original: T, extra?: Partial<T>): T => {
  return extra ? { ...extra, ...original } : original;
}

export default function createStore<TModels extends Models<TModels>>(config: InitConfig<TModels>): Store<TModels> {
  const { plugins = [] } = config;

  let models: Models<TModels> = config.models;

  plugins.forEach((plugin: Plugin<TModels>) => {
    if (plugin.config) {
      models = merge(models, plugin.config.models);
    }
  });

  const on = (eventName: string, callback: (pluginEvent: any) => void): void => {
    plugins.forEach((plugin: Plugin<TModels>) => {
      if (plugin[eventName]) {
        callback(plugin[eventName]);
      }
    });
  };

  const getState = (initialState: Record<string, any> = {}): Record<string, any> => {
    const newInitialState: Record<string, any> = {};

    Object.keys(models).forEach((modelFilename: string) => {
      const model: Model<TModels> = models[modelFilename] || {};
      const modelName = model.name || modelFilename;
      newInitialState[modelName] = Object.assign({}, model.state, initialState[modelName])
    });

    return newInitialState;
  };

  const getReducer = (state: Record<string, any> = {}, action: Action = {} as Action): Record<string, any> => {
    const newState: Record<string, any> = {};

    Object.keys(models).forEach((modelFilename: string) => {
      const model: Model<TModels> = models[modelFilename] || {};
      const { reducers = {}, name: modelName = modelFilename } = model;
      let reducerState = state[modelName];
      const actionType = action.type?.replace?.(`${modelName}/`, '');

      if (actionType && actionType in reducers) {
        reducerState = reducers[actionType](reducerState, action.payload, action.params);
      }

      newState[modelName] = reducerState;
    });

    return newState;
  };

  const getEffect = (dispatch: any, state: Record<string, any> = {}) => {
    const newEffects: Record<string, ModelEffects<TModels>> = {};

    Object.keys(models).forEach((modelFilename: string) => {
      const modelDispatcher: ModelDispatchers = {} as ModelDispatchers;
      const model: Model<TModels> = models[modelFilename] || {};
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

      Object.keys(reducers).forEach((actionName: string) => {
        const type = `${modelName}/${actionName}`;

        modelDispatcher[actionName] = (payload: any, params?: any) => {
          dispatch({
            type,
            payload,
            params
          });
        };
      });

      let effects: any;
      dispatch[modelName] = modelDispatcher;

      if (typeof effectsFromConfig === 'function') {
        effects = effectsFromConfig(dispatch);
      } else {
        effects = effectsFromConfig || {};
      }

      const effectObj: ModelEffects<TModels> = {};

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
