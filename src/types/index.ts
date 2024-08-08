import useContextSelector from "../hooks/useContextSelector";

type ModelEffect = {
  payload: Action['payload']
}

type ModelReducer = {
  state: any
  payload?: Action['payload']
}

export interface Action {
  type?: any
  payload?: any
  params?: any
}

export interface Config {
  models?: Models
}

export interface InitConfig {
  models?: Models
  plugins?: any
}

export interface Models {
  [key: string]: Model
}

export interface Model {
  name?: string
  state: any
  effects?: ModelEffects | ((dispatch?: any) => ModelEffects)
  reducers?: ModelReducers
}

export interface ModelEffects {
  [key: string]: ModelEffect
}

export interface ModelReducers {
  [key: string]: (state?: any, payload?: Action['payload'], params?: Action['params']) => ModelReducer
}

export interface ModelDispatchers {
  state?: any
}

export interface Plugins {
  [key: string]: Plugin
}

export interface Plugin {
  config?: Config
}

export interface PluginConfig {
  name?: string
}

export interface ContextValue {
  subscribe?: any
  dispatch?: any
  state?: any
  effects?: ModelEffects | ((dispatch?: any) => ModelEffects)
  getState?: any
}

export interface ContextSelectorParams {
  isWithSyncExternalStore?: boolean
}
