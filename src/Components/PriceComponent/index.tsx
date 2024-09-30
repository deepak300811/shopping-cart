type PropTypes = {
  originalPrice: number;
  discountedPrice?: number;
};
const PriceComponent = (props: PropTypes) => {
  const { originalPrice, discountedPrice = 0 } = props;
  const findPercentage = () => {
    return Math.floor(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  return (
    <>
      <span className="main-text">₹ {discountedPrice || originalPrice}</span>
      {discountedPrice && (
        <span className="not-important">
          &nbsp; M.R.P <span className="strik-off"> ₹{originalPrice}</span> <span>({findPercentage()}% off)</span>
        </span>
      )}
    </>
  );
};

export default PriceComponent;
