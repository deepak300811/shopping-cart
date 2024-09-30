import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
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
import { NavList, Product } from "../types";
import { generic_error } from "../constants";

const useMainContainer = () => {
  const { state, dispatch } = useContext(App);
  const [selectedPage, setSelectedPage] = useState("HOMEPAGE");

  const fetchProducts = async () => {
    try {
      dispatch(startLoader());
      const productCollection = collection(db, "products");
      const productSnapshot = await getDocs(productCollection);
      const productList = productSnapshot.docs.map((doc, index) => ({
        id: doc.id,
        quantity: 0,
        indexNumber: index,
        name: doc.data().name,
        originalPrice: doc.data().originalPrice,
        photoLink: doc.data().photoLink,
        description: doc.data().description,
        stock: doc.data().stock,
        discountedPrice: doc.data().discountedPrice,
      }));
      dispatch(setProductList(productList));
    } catch (error) {
      dispatch(stopLoader());
      dispatch(
        setError(generic_error, () => {
          dispatch(unsetError());
          fetchProducts();
        })
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleButtonClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const itemClickedId = target.getAttribute("data-index");
      if (itemClickedId) {
        dispatch(handleProductSelection(itemClickedId));
      }
    },
    [dispatch]
  );

  const handleProductRemoval = (index: number, removalType: string) => {
    if (removalType === "ONE") {
      dispatch(handleRemoveOneProduct(index));
    } else {
      dispatch(handleRemoveProductCompletely(index));
    }
  };

  const getNavBarItems = useMemo((): NavList => {
    let navItems: NavList = [];
    const commonNavItems:NavList = [
      {
        linkName: "Home",
        icon: null,
        isSelected: false,
        handleClick: () => setSelectedPage("HOMEPAGE"),
      },
      {
        linkName: "Address",
        icon: null,
        isSelected: false,
        handleClick: () => setSelectedPage("ADDRESS"),
      },
    ];

    if (selectedPage === "HOMEPAGE" && state.totalNoOfSelectedProdcuts && state.selectedAddressIndex > -1) {
      navItems = [
        ...commonNavItems,
        {
          linkName: "Checkout",
          icon: null,
          isSelected: false,
          handleClick: () => setSelectedPage("CHECKOUT"),
        },
      ];
    } else if (selectedPage === "HOMEPAGE" && state.totalNoOfSelectedProdcuts) {
      navItems = [
        {
          linkName: "Continue",
          icon: null,
          isSelected: false,
          isButton: true,
          handleClick: () => setSelectedPage("ADDRESS"),
        },
      ];
    } else if (selectedPage === "CHECKOUT") {
      navItems = [
        ...commonNavItems,
        {
          linkName: "Checkout",
          icon: null,
          isSelected: false,
          handleClick: () => setSelectedPage("CHECKOUT"),
        },
      ];
    }

    return navItems;
  }, [selectedPage, state.totalNoOfSelectedProdcuts, state.selectedAddressIndex]);

  return {
    state,
    selectedPage,
    setSelectedPage,
    handleButtonClick,
    handleProductRemoval,
    getNavBarItems,
  };
};

export default useMainContainer;
