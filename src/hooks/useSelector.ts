import useContextSelector from './useContextSelector';

const useSelector = (mapStateToProps: any) => {
  return useContextSelector(mapStateToProps);
};

export default useSelector
