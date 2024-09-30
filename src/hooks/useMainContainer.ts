import { collection, getDocs } from "firebase/firestore";
import { useContext, useEffect, useCallback, useState } from "react";
import { db } from "../firebase";
import { App } from "../store/Context";
import {
  setProductList,
  handleProductSelection,
  handleRemoveOneProduct,
  handleRemoveProductCompletely,
  startLoader,
  stopLoader,
  setError,
  unsetError,
} from "../store/actionCreators";
import { generic_error } from "../constants";

export const useMainContainerHook = () => {
    const { state, dispatch } = useContext(App);
    const [selectedPage, setSelectedPage] = useState("HOMEPAGE");
  
    const fetchProducts = useCallback(async () => {
      try {
        dispatch(startLoader());
        const productCollection = collection(db, "products");
        const productSnapshot = await getDocs(productCollection); // Fetch data one time
        let index = 0;
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          quantity: 0,
          indexNumber: index++,
          name: doc.data().name,
          originalPrice: doc.data().originalPrice,
          photoLink: doc.data().photoLink,
          description: doc.data().description,
          stock: doc.data().stock,
          discountedPrice: doc.data().discountedPrice,
        }));
        console.log("Fetched productList=", productList);
        dispatch(setProductList(productList));
      } catch (error) {
        dispatch(stopLoader());
        dispatch(
          setError(generic_error, () => {
            dispatch(unsetError());
            fetchProducts();
          })
        );
        console.error("Error fetching products: ", error);
      }
    }, []);
  
    useEffect(() => {
      fetchProducts(); // Call the fetch function
    }, []); // Empty dependency array for one-time fetch
  
    const handleButtonClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement; // Explicitly cast target to HTMLElement
      const itemClickedId = target.getAttribute("data-index");
      console.log("itemClickedId=", itemClickedId);
      if (itemClickedId) {
        dispatch(handleProductSelection(itemClickedId));
      }
    }, []);
    console.log("state=", state);
    const handleProductRemoval = (index: number, removalType: string) => {
      if (removalType === "ONE") {
        dispatch(handleRemoveOneProduct(index));
      } else {
        dispatch(handleRemoveProductCompletely(index));
      }
    };

  return {
    state,
    selectedPage,
    setSelectedPage,
    handleButtonClick,
    handleProductRemoval,
    
  };
};
