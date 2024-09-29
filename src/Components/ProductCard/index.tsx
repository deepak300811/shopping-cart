type propTypes = {
  stock?: number;
  name: string;
  description: string;
  discountedPrice?: number;
  originalPrice: number;
  id: string;
  photoLink: string;
  quantity: number;
  onRemoveProduct: (id: string, type: string) => void;
};

const ProductCard = (props: propTypes) => {
  const { stock = Math.max, name, photoLink = "", description, discountedPrice = 0, originalPrice, id, quantity = 0, onRemoveProduct } = props;
  const findPercentage = () => {
    return Math.floor(((originalPrice - discountedPrice) / originalPrice) * 100);
  };
  return (
    <div className="product-card pb-4 pl-4 pr-4">
      <div className=" image-container">
        <img loading="lazy" src={photoLink} alt={name} className="responsive-img" />
      </div>
      <div className="product-body mb-2 pb-4 ">
        <p className="main-text mb-1">{name}</p>
        <p className="description-style mb-1 ">{description}</p>
        <span className="main-text">₹ {discountedPrice || originalPrice}</span>
        {discountedPrice && (
          <span className="not-important">
            &nbsp; M.R.P <span className="strik-off"> ₹{originalPrice}</span> <span>({findPercentage()}% off)</span>
          </span>
        )}
      </div>

      <section className="">
        <button className="primary-btn w-full pt-2 pb-2 " data-id={id}>
          Add to cart
        </button>
      </section>
      {quantity > 0 && (
        <section className="quantity mt-4">
          <p className="quantity-line"> {quantity} in cart - </p>{" "}
          <p className="remove-from-cart">
            <button className="remove-text" onClick={() => onRemoveProduct(id, "ONE")}>
              Remove 1
            </button>
            <span className="separator">|</span>{" "}
            <button className="remove-text" onClick={() => onRemoveProduct(id, "ALL")}>
              Remove All
            </button>
          </p>
        </section>
      )}
    </div>
  );
};

export default ProductCard;
