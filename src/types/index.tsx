export interface Product {
    id: string;
    name: string;
    originalPrice: number;
    discountedPrice?: number;
    stock?: number;
    photoLink: string;
    description: string;
    quantity: number;
  }

  export type ProductList = Product[];
  export interface Address{
    addressLine1:string;
    addressLine2?:string;
    city:string;
    pin:string;
    receiverName:string;
    state:string;
    country:string;
    id?:string;
    isSelected?:boolean;
  }
  
  export type AddressForm = Omit<Address, "id" | "isSelected">;


  export type AddressList = Address[];

  export interface State{
      productList:ProductList;
      addressList:AddressList
  }

  export interface Action{
      type:string;
      payload?:any;
  }
