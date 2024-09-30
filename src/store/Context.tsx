import React, { ReactNode, useReducer, Dispatch } from "react";
import ShoppingCartReducer from './reducer';
import { State, Action } from '../types';

// Create the initial state based on your types
const initialState: State = {
  productList: [],
  addressList: [],
  selectedAddressIndex:-1,
  totalNoOfSelectedProdcuts:0,
  isLoading:false,
  errorMessageIfApplicable:{
    error:"",
    onClickFunction:()=>{}
  }
};

// Define the context with correct types
export const App = React.createContext<{
  state: State;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const AppContext = ({ children }: { children: ReactNode }) => {
  // Define the types for useReducer explicitly
  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(
    ShoppingCartReducer,
    initialState
  );

  return (
    <App.Provider value={{ state, dispatch }}>
      {children}
    </App.Provider>
  );
};

export default AppContext;
