import {
  SET_PRODUCT_LIST,
  INCREASE_ITEM_QUANTITY,
  REMOVE_ONE_PRODUCT,
  REMOVE_PRODUCT_COMPLETELY,
  SET_ADDRESS_LIST,
  ADD_NEW_ADDRESS,
  SET_SELECTED_ADDRESS,
  REMOVE_ALL_PRODUCT_SELECTION,
  REMOVE_ADDRESS_SELECTION,
  START_LOADING,
  STOP_LOADING,
  SET_ERROR,
  UNSET_ERROR,
} from "./actionTypes";
import { Action, Address, AddressList, Product, State } from "../types";

const ShoppingCartReducer = (state: State, action: Action) => {
  switch (action.type) {
    case SET_PRODUCT_LIST: {
      // Initialize the product list and add the indexNumber
      const productListWithIndex = action.payload.map((product: Product, index: number) => ({
        ...product,
        indexNumber: index, // Assign indexNumber when setting the product list
      }));

      return {
        ...state,
        productList: productListWithIndex,
        isLoading:false
      };
    }

    case INCREASE_ITEM_QUANTITY: {
      const index = action.payload; // Assuming the indexNumber is passed as payload
      const tempList = [...state.productList]; // Create a shallow copy of the product list
      if (tempList[index]) {
        tempList[index].quantity += 1; // Directly increase the quantity by the index
        state.totalNoOfSelectedProdcuts+=1;
      }
      return {
        ...state,
        productList: tempList,
      };
    }

    case REMOVE_ONE_PRODUCT: {
      const index = action.payload;
      const tempList = [...state.productList];
      if (tempList[index] && tempList[index].quantity > 0) {
        tempList[index].quantity -= 1;
        state.totalNoOfSelectedProdcuts-=1;
      }
      return {
        ...state,
        productList: tempList,
      };
    }

    case REMOVE_PRODUCT_COMPLETELY: {
      const index = action.payload;
      const tempList = [...state.productList];
      if (tempList[index]) {
        state.totalNoOfSelectedProdcuts=state.totalNoOfSelectedProdcuts-tempList[index].quantity;
        tempList[index].quantity = 0; // Set the quantity to 0 to remove completely
      }
      return {
        ...state,
        productList: tempList,
      };
    }

    case SET_ADDRESS_LIST: {
      return {
        ...state,
        addressList: action.payload,
        isLoading:false
      };
    }

    case ADD_NEW_ADDRESS: {
      const tempArr: AddressList = state.addressList.map((address: Address) => ({
        ...address,
        isSelected: false,
      }));

      tempArr.unshift(action.payload); // Add the new address to the top of the list
      state.selectedAddressIndex=0;
      state.isLoading=false
      return {
        ...state,
        addressList: tempArr,
        
      };
    }

    case SET_SELECTED_ADDRESS: {
      const tempArr: AddressList = state.addressList.map((address: Address,index) => {
        if (address.id === action.payload) {
          state.selectedAddressIndex=index
          return {
            ...address,
            isSelected: true,
          };
        } else {
          return {
            ...address,
            isSelected: false,
          };
        }
      });
      return {
        ...state,
        addressList: tempArr,
      };
    }

    case REMOVE_ALL_PRODUCT_SELECTION: {
      const tempList = state.productList.map((product: Product) => ({
        ...product,
        quantity: 0,
      }));

      return {
        ...state,
        productList: tempList,
        totalNoOfSelectedProdcuts:0
      };
    }

    case REMOVE_ADDRESS_SELECTION: {
      const tempArr: AddressList = state.addressList.map((address: Address) => ({
        ...address,
        isSelected: false,
      }));
      state.selectedAddressIndex=-1
      return {
        ...state,
        addressList: tempArr,
      };
    }

    case START_LOADING:{
      return {
        ...state,
        isLoading:true
      }
    }
    case STOP_LOADING:{
      return {
        ...state,
        isLoading:false
      }
    }
    case SET_ERROR:{
      return {
        ...state,
        errorMessageIfApplicable:{
          error:action.payload.error,
          onClickFunction:action.payload.onClickFunction
        }
      }
    }
    case UNSET_ERROR:{
      return {
        ...state,
        errorMessageIfApplicable:{
          error:"",
          onClickFunction:""
        }
      }
    }

    default: {
      return state
    }
  }
};

export default ShoppingCartReducer;
