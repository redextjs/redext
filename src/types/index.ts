export interface Store<TModels extends Models<TModels>> {
  getState: (initialState?: Record<string, any>) => Record<string, any>;
  getReducer: (state?: Record<string, any>, action?: Action) => Record<string, any>;
  getEffect: (dispatch: any, state?: Record<string, any>) => {
    effects: Record<string, ModelEffects<TModels>>;
    models: Models<TModels>;
    dispatch: Dispatch<TModels>;
    on: (eventName: string, callback: (pluginEvent: any) => void) => void;
  };
}

export type ExtractDispatchersFromModels<
  TModels extends Models<TModels>
> = {
  [modelName in keyof TModels]: TModels[modelName] extends Model<TModels> ? ModelDispatchers<TModels> : never
}

export interface ContextDispatch<A extends Action> {
  <T extends A>(action: T): T
}

export type Dispatch<TModels extends Models<TModels>> = ContextDispatch<any> & ExtractDispatchersFromModels<TModels>

export type ExtractStateFromModels<
  TModels extends Models<TModels>
> = { [modelName in keyof TModels]: TModels[modelName]['state'] }

export type State<TModels extends Models<TModels>> = ExtractStateFromModels<TModels>

export type ModelEffectThis = {
  [key: string]: (payload?: any) => Action<any>
}

export type ModelEffect<TModels extends Models<TModels>> = (
  this: ModelEffectThis,
  payload: Action['payload']
) => any

export type ModelReducer<TState = any> = (
  state: TState,
  payload?: Action['payload'],
  params?: Action['params']
) => TState | void

export interface Action<TPayload = any> {
  type?: string
  payload?: TPayload
  params?: any
}

export interface Config<TModels extends Models<TModels>> {
  models?: TModels
}

export interface InitConfig<TModels extends Models<TModels>> {
  models: TModels
  plugins?: Plugin<TModels>[]
}

export interface Models<TModels extends Models<TModels>> {
  [key: string]: Model<TModels>
}

export interface Model<TModels extends Models<TModels>, TState = any> {
  name?: string
  state: TState
  effects?: ModelEffects<TModels> | ((dispatch?: Dispatch<TModels>) => ModelEffects<TModels>)
  reducers?: ModelReducers
}

export interface ModelEffects<TModels extends Models<TModels>> {
  [key: string]: ModelEffect<TModels>
}

export interface ModelReducers<TState = any> {
  [key: string]: ModelReducer<TState>
}

export interface ModelDispatchers<TState = any> {
  state?: TState
}

export interface Plugins<TModels extends Models<TModels>> {
  [key: string]: Plugin<TModels>
}

export interface Plugin<TModels extends Models<TModels>> {
  config?: Config<TModels>
}

export interface PluginConfig {
  name?: string
}

export interface ContextValue<TModels extends Models<TModels>> {
  subscribe?: any
  dispatch?: Dispatch<TModels>
  state?: any
  effects?: ModelEffects<TModels> | ((dispatch?: Dispatch<TModels>) => ModelEffects<TModels>)
  getState?: any
}

export interface ContextSelectorParams {
  isWithSyncExternalStore?: boolean
}
