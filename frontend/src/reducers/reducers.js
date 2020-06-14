export function reducer(
  state = {
    errorMessage: '',
    notifMessage: '',
    predictionLabel: '',
    selectedImage: 1,
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
    case 'SET_SELECTED_IMAGE':
      return {
        ...state,
        selectedImage: action.data,
      };

    default:
      return state;
  }
}
