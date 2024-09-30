import { useMemo } from "react";
import { useState } from "react";
import { useContext } from "react";
import PriceComponent from "../../Components/PriceComponent";
import ProductCard from "../../Components/ProductCard";
import Redirect from "../../Components/Redirect";
import { generic_error } from "../../constants";
import { removeAddressSelection, removeAllProductSelection, setError, startLoader, stopLoader, unsetError } from "../../store/actionCreators";
import { App } from "../../store/Context";
import { Product, TotalAmount } from "../../types";

type PropTypes = {
  handleHomepageRedirection:()=>void;
  onRemoveProduct: (index: number, type: string) => void;
};

const CheckoutPage = (props: PropTypes) => {
  const { state, dispatch } = useContext(App);
  const [isRedirecting,setIsRedirecting] = useState(false);
  const { onRemoveProduct,handleHomepageRedirection } = props;
  const selectedProducts = useMemo(() => {
    return state?.productList?.filter((product: Product) => {
      if (product.quantity > 0) {
        return true;
      }
      return false;
    });
  }, [state?.productList]);
  const totalAmount: TotalAmount = useMemo(() => {
    const priceObj = {
      totalOriginalAmt: 0,
      totalDiscountedAmt: 0,
    };

    if (selectedProducts.length > 0) {
      selectedProducts.forEach((product: Product) => {
        priceObj.totalOriginalAmt =priceObj.totalOriginalAmt + product.quantity * product.originalPrice;
        priceObj.totalDiscountedAmt =priceObj.totalDiscountedAmt + product.quantity * (product?.discountedPrice || 0);
      });
    }
    console.log("inside total=",priceObj)
    return {...priceObj};
  }, [selectedProducts]);

  const handlePaymentAndRedirection= async () => {
    try {
      dispatch(startLoader())
      const inputBody={ productList: selectedProducts,bill:totalAmount.totalDiscountedAmt }
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(inputBody),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      
      if (response.ok) {
        dispatch(stopLoader())
        setIsRedirecting(true)
      } else {
        dispatch(stopLoader())
        dispatch(setError(generic_error,()=>{dispatch(unsetError())}))
        throw new Error("Failed to process order.");
      }
    } catch (error) {
      dispatch(stopLoader())
      dispatch(setError(generic_error,()=>{dispatch(unsetError())}))
    }
  };
 const handleAfterSuccessfulPayment=()=>{
   dispatch(removeAllProductSelection())
   dispatch(removeAddressSelection())
  handleHomepageRedirection()
 }

 const handleDeselection=()=>{
  dispatch(removeAllProductSelection())
  handleHomepageRedirection()
 }

  return (
    <>
    {
      isRedirecting && <Redirect handleRedirection={handleAfterSuccessfulPayment}/>
    }

    <div>
      <p className="page-heading mb-0">Shopping Cart</p>
      <button className="new-address-link button-as-text mb-2" onClick={handleDeselection}>Deselect all items</button>
      <div className="separator"></div>
      <div className=" rounded total-price-component flex-column flex items-center sticky top-2 bg-white p-4 shadow mt-4 mb-4">
        <section className="flex flex-column justify-center">
          <p className="font-base mr-2 ">Subtotal ({state?.totalNoOfSelectedProdcuts} items) </p>{" "}
          <div>
            <PriceComponent originalPrice={totalAmount.totalOriginalAmt} discountedPrice={totalAmount.totalDiscountedAmt} />
          </div>
        </section>
        <section className="mt-4 width-60-percent">
          <button className="primary-btn w-full p-2" onClick={handlePaymentAndRedirection}>Proceed To Buy</button>
        </section>
      </div>
      <div className="product-container mt-4 checkout-page">
        {selectedProducts.length > 0 &&
          selectedProducts.map((product: Product) => {
            return (
              <ProductCard
                id={product.id}
                name={product.name}
                originalPrice={product.originalPrice}
                discountedPrice={product?.discountedPrice}
                stock={product?.stock}
                photoLink={product?.photoLink}
                description={product?.description}
                quantity={product?.quantity || 0}
                key={product.id}
                onRemoveProduct={onRemoveProduct}
                isCheckoutPage={true}
                indexNumber={product.indexNumber}
              />
            );
          })}
      </div>
    </div>
    </>
  );
};

export default CheckoutPage;
