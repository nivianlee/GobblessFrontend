export function reducer(
  state = {
    errorMessage: '',
    notifMessage: '',
    predictionLabel: '',
  },
  action
) {
  switch (action.type) {
    case 'SET_ERRORMESSAGE':
      return {
        ...state,
        errorMessage: action.data,
      };
    case 'SET_NOTIFMESSAGE':
      return {
        ...state,
        notifMessage: action.data,
      };
    case 'SET_PREDICTION_LABEL':
      return {
        ...state,
        predictionLabel: action.data,
      };

    default:
      return state;
  }
}
