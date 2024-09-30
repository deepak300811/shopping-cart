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
      };
    }

    case INCREASE_ITEM_QUANTITY: {
      const index = action.payload; // Assuming the indexNumber is passed as payload
      const tempList = [...state.productList]; // Create a shallow copy of the product list
      if (tempList[index]) {
        tempList[index].quantity += 1; // Directly increase the quantity by the index
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
      };
    }

    case ADD_NEW_ADDRESS: {
      const tempArr: AddressList = state.addressList.map((address: Address) => ({
        ...address,
        isSelected: false,
      }));

      tempArr.unshift(action.payload); // Add the new address to the top of the list
      return {
        ...state,
        addressList: tempArr,
      };
    }

    case SET_SELECTED_ADDRESS: {
      const tempArr: AddressList = state.addressList.map((address: Address) => {
        if (address.id === action.payload) {
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
      };
    }

    case REMOVE_ADDRESS_SELECTION: {
      const tempArr: AddressList = state.addressList.map((address: Address) => ({
        ...address,
        isSelected: false,
      }));
      return {
        ...state,
        addressList: tempArr,
      };
    }

    default: {
      return state
    }
  }
};

export default ShoppingCartReducer;
