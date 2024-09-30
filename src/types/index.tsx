import { ReactNode } from "react";

export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice?: number;
  stock?: number;
  photoLink: string;
  description: string;
  quantity: number;
  indexNumber: number;
}

export type ProductList = Product[];
export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pin: string;
  receiverName: string;
  state: string;
  country: string;
  id?: string;
  isSelected?: boolean;
}

export type AddressForm = Omit<Address, "id" | "isSelected">;

export type AddressList = Address[];

export interface State {
  productList: ProductList;
  addressList: AddressList;
  totalNoOfSelectedProdcuts:number,
  selectedAddressIndex:number,
  isLoading:boolean;
  errorMessageIfApplicable:{error:string,onClickFunction:()=>void};
}

export interface Action {
  type: string;
  payload?: any;
}
export interface TotalAmount {
  totalDiscountedAmt: number;
  totalOriginalAmt: number;
}

export interface NavItem {
  linkName: string;
  icon: ReactNode;
  isSelected: false;
  handleClick: () => void;
  isButton?:boolean;
}

export type NavList = NavItem[];
