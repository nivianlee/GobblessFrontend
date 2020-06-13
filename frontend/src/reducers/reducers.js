export function reducer(
  state = {
    errorMessage: '',
  },
  action
) {
  switch (action.type) {
    case 'SET_ERRORMESSAGE':
      return {
        ...state,
        errorMessage: action.data,
      };

    default:
      return state;
  }
}
