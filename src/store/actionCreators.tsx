import { Address, AddressList, ProductList } from "../types";
import {
  SET_SELECTED_ADDRESS,
  ADD_NEW_ADDRESS,
  SET_ADDRESS_LIST,
  REMOVE_PRODUCT_COMPLETELY,
  REMOVE_ONE_PRODUCT,
  INCREASE_ITEM_QUANTITY,
  SET_PRODUCT_LIST,
  REMOVE_ADDRESS_SELECTION,
  REMOVE_ALL_PRODUCT_SELECTION
} from "./actionTypes";
export const setProductList = (productList: ProductList) => {
  return { type: SET_PRODUCT_LIST, payload: productList };
};
export const handleProductSelection = (selectedProduct: string) => {
  return { type: INCREASE_ITEM_QUANTITY, payload: selectedProduct };
};
export const handleRemoveOneProduct = (index: number) => {
  return { type: REMOVE_ONE_PRODUCT, payload: index };
};
export const handleRemoveProductCompletely = (index: number) => {
  return { type: REMOVE_PRODUCT_COMPLETELY, payload: index };
};
export const setAddressList = (addressList: AddressList) => {
  return { type: SET_ADDRESS_LIST, payload: addressList };
};
export const addNewAddress = (address: Address) => {
  return { type: ADD_NEW_ADDRESS, payload: address };
};
export const setSelectedAddress = (id: string) => {
  return { type: SET_SELECTED_ADDRESS, payload: id };
};
export const removeAddressSelection = () => {
  return { type: REMOVE_ADDRESS_SELECTION };
};
export const removeAllProductSelection = () => {
  return { type: REMOVE_ALL_PRODUCT_SELECTION };
};