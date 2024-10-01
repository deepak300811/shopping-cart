import Cart from '../../icons/Cart'

type propTypes = {
  itemsInCart: number;
}

const CartWithNumber = (props: propTypes) => {
  const { itemsInCart } = props;

  return (
    <div className='cart-container'>
      <span data-testid="number-of-items" className='number-of-items-in-cart'>{itemsInCart}</span>
      <div data-testid="cart-icon">

      <Cart />
      </div>
    </div>
  )
}

export default CartWithNumber;
