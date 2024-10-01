import React from "react";
import { TotalAmount } from "../../types";
import PriceComponent from "../PriceComponent"
type PropTypes={
  totalNoOfSelectedProdcuts:number;
  totalAmount:TotalAmount;
  handlePaymentAndRedirection:()=>void;
}
const SubtotalCard = React.memo((props:PropTypes) => {
  const {totalNoOfSelectedProdcuts,totalAmount,handlePaymentAndRedirection} = props
  return (
    <div className=" rounded total-price-component flex-column flex items-center sticky top-2 bg-white p-4 shadow mt-4 mb-4">
    <section className="flex flex-column justify-center">
      <p className="font-base mr-2 ">Subtotal ({totalNoOfSelectedProdcuts} items) </p>{" "}
      <div>
        <PriceComponent originalPrice={totalAmount.totalOriginalAmt} discountedPrice={totalAmount.totalDiscountedAmt} />
      </div>
    </section>
    <section className="mt-4 width-60-percent">
      <button className="primary-btn w-full p-2" onClick={handlePaymentAndRedirection}>Proceed To Buy</button>
    </section>
  </div>
  )
})

export default SubtotalCard