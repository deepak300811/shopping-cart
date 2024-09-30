import PriceComponent from "../PriceComponent";

type propTypes = {
  stock?: number;
  name: string;
  description: string;
  discountedPrice?: number;
  originalPrice: number;
  id: string;
  photoLink: string;
  quantity: number;
  onRemoveProduct: (index: number, type: string) => void;
  isCheckoutPage?: boolean;
  indexNumber:number
};

const ProductCard = (props: propTypes) => {
  const { name, photoLink = "", description, discountedPrice = 0, originalPrice, id, quantity = 0, onRemoveProduct, isCheckoutPage = false,indexNumber } = props;

  return (
    <div className={`product-card pb-4 pl-4 pr-4 pt-4 ${isCheckoutPage ? "on-checkout-page flex items-center" : ""}`}>
      <div className=" image-container">
        <img loading="lazy" src={photoLink} alt={name} className="responsive-img" />
      </div>
      <div>
        <div className={`product-body  pb-4 ${!isCheckoutPage ? "mb-2" : ""}`}>
          <p className="main-text mb-1">{name}</p>
          <p className="description-style mb-1 ">{description}</p>
          <PriceComponent discountedPrice={discountedPrice} originalPrice={originalPrice} />
        </div>

        {!isCheckoutPage && (
          <section className="">
            <button className="primary-btn w-full pt-2 pb-2 " data-id={id} data-index={indexNumber}>
              Add to cart
            </button>
          </section>
        )}

        {quantity > 0 && !isCheckoutPage && (
          <section className="quantity mt-4">
            <p className="quantity-line"> {quantity} in cart - </p>{" "}
            <p className="remove-from-cart">
              <button className="remove-text" onClick={() => onRemoveProduct(indexNumber, "ONE")}>
                Remove 1
              </button>
              <span className="separator-pipe">|</span>{" "}
              <button className="remove-text" onClick={() => onRemoveProduct(indexNumber, "ALL")}>
                Remove All
              </button>
            </p>
          </section>
        )}
        {quantity > 0 && isCheckoutPage && (
          <section className="quantity">
            <button onClick={() => onRemoveProduct(indexNumber, "ONE")} className="toggle-quantity desc">
              -
            </button>
            <p className="quantity-line ml-1 mr-1"> {quantity} in cart</p>

            <button data-id={id} data-index={indexNumber} className="toggle-quantity incr">
              +
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
