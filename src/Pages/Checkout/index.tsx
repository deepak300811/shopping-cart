import ProductCard from "../../Components/ProductCard";
import Redirect from "../../Components/Redirect";
import SubtotalCard from "../../Components/SubtotalCard";
import { useCheckoutPage } from "../../hooks/useCheckoutPage";
import { Product } from "../../types";

type PropTypes = {
  handleHomepageRedirection: () => void;
  onRemoveProduct: (index: number, type: string) => void;
};

const CheckoutPage = (props: PropTypes) => {
  const { onRemoveProduct, handleHomepageRedirection } = props;
  
  const {
    selectedProducts,
    totalAmount,
    isRedirecting,
    handlePaymentAndRedirection,
    handleAfterSuccessfulPayment,
    handleDeselection,
    state
  } = useCheckoutPage(handleHomepageRedirection);

  return (
    <>
      {isRedirecting && <Redirect handleRedirection={handleAfterSuccessfulPayment} />}

      <div>
        <p className="page-heading mb-0">Shopping Cart</p>
        <button className="new-address-link button-as-text mb-2" onClick={handleDeselection}>
          Deselect all items
        </button>
        <div className="separator"></div>
        <SubtotalCard
          handlePaymentAndRedirection={handlePaymentAndRedirection}
          totalAmount={totalAmount}
          totalNoOfSelectedProdcuts={state?.totalNoOfSelectedProdcuts}
        />
        <div className="product-container mt-4 checkout-page">
          {selectedProducts.length > 0 &&
            selectedProducts.map((product: Product) => (
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
            ))}
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
