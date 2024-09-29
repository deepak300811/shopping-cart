import React,{ ReactNode } from "react";
import { useReducer } from "react";
import ShoppingCartReducer from './reducer'

export const App = React.createContext({});

const initialState={
    productList:[],
    selectedProductList:[],
    addressList:[]
}

const AppContext = ({ children }: { children: ReactNode }) => {
  const [state,dispatch] = useReducer(ShoppingCartReducer,initialState)
  return <App.Provider value={{state,dispatch}}>{children}</App.Provider>;
};

export default AppContext;
