import { useMemo, useState, useCallback, useContext } from "react";
import {
  removeAddressSelection,
  removeAllProductSelection,
  setError,
  startLoader,
  stopLoader,
  unsetError,
} from "../store/actionCreators";
import { App } from "../store/Context";
import { Product, TotalAmount } from "../types";
import { generic_error } from "../constants";

export const useCheckoutPage = (handleHomepageRedirection: () => void) => {
  const { state, dispatch } = useContext(App);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Get selected products with quantity > 0
  const selectedProducts = useMemo(() => {
    return state?.productList?.filter((product: Product) => product.quantity > 0);
  }, [state?.productList]);

  // Calculate total original and discounted amounts
  const totalAmount: TotalAmount = useMemo(() => {
    const priceObj = {
      totalOriginalAmt: 0,
      totalDiscountedAmt: 0,
    };
    selectedProducts.forEach((product: Product) => {
      priceObj.totalOriginalAmt += product.quantity * product.originalPrice;
      priceObj.totalDiscountedAmt += product.quantity * (product?.discountedPrice || 0);
    });
    return { ...priceObj };
  }, [selectedProducts]);

  // Handle payment processing and redirection
  const handlePaymentAndRedirection = useCallback(async () => {
    try {
      dispatch(startLoader());
      const inputBody = { productList: selectedProducts, bill: totalAmount.totalDiscountedAmt };
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(inputBody),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      if (response.ok) {
        dispatch(stopLoader());
        setIsRedirecting(true);
      } else {
        throw new Error("Failed to process order.");
      }
    } catch (error) {
      dispatch(stopLoader());
      dispatch(setError(generic_error, () => dispatch(unsetError())));
    }
  }, [selectedProducts, totalAmount, dispatch]);

  // After successful payment, clear selections and redirect
  const handleAfterSuccessfulPayment = () => {
    dispatch(removeAllProductSelection());
    dispatch(removeAddressSelection());
    handleHomepageRedirection();
  };

  // Deselect all products and redirect to the homepage
  const handleDeselection = () => {
    dispatch(removeAllProductSelection());
    handleHomepageRedirection();
  };

  return {
    selectedProducts,
    totalAmount,
    isRedirecting,
    handlePaymentAndRedirection,
    handleAfterSuccessfulPayment,
    handleDeselection,
    state
  };
};
