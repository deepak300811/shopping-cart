import {
  ADD_NEW_ITEM_TO_CART,
  SET_PRODUCT_LIST,
  INCREASE_ITEM_QUANTITY,
  REMOVE_ONE_PRODUCT,
  REMOVE_PRODUCT_COMPLETELY,
  SET_ADDRESS_LIST,
  ADD_NEW_ADDRESS,
  SET_SELECTED_ADDRESS,
} from "./actionTypes";
import { Action, Address, AddressList, Product, State } from "../types";
const ShoppingCartReducer = (state: State, action: Action) => {
  switch (action.type) {
    case SET_PRODUCT_LIST: {
      return {
        ...state,
        productList: action.payload,
      };
    }
    case INCREASE_ITEM_QUANTITY: {
      const tempList = state.productList.map((product: Product) => {
        if (product.id === action.payload) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        } else {
          return product;
        }
      });

      return {
        ...state,
        productList: tempList,
      };
    }

    case REMOVE_ONE_PRODUCT: {
      const tempList = state.productList.map((product: Product) => {
        if (product.id === action.payload) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        } else {
          return product;
        }
      });

      return {
        ...state,
        productList: tempList,
      };
    }

    case REMOVE_PRODUCT_COMPLETELY: {
      const tempList = state.productList.map((product: Product) => {
        if (product.id === action.payload) {
          return {
            ...product,
            quantity: 0,
          };
        } else {
          return product;
        }
      });

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
      const tempArr: AddressList = state.addressList.map((address: Address) => {
        return {
          ...address,
          isSelected: false,
        };
      });

      tempArr.unshift(action.payload);
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
        addressList:tempArr
      }
    }


    default: {
      break;
    }
  }
};

export default ShoppingCartReducer;
