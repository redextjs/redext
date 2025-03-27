import { useContext } from 'react';
import Context from '../Context';

import type { ContextValue } from '../types';

export default function useDispatch() {
  const { dispatch }: ContextValue<any> = useContext(Context);

  return dispatch;
}
