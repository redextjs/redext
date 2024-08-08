import { useContext } from 'react';
import Context from '../Context';

import type { ContextValue } from '../types';

export default function useDispatch() {
  const { dispatch }: ContextValue = useContext(Context);

  return dispatch;
}
