import Cart from '../../icons/Cart'
type propTypes={
    itemsInCart:number
}
const CartWithNumer = (props:propTypes) => {
    const {itemsInCart} = props;

  return (
    <div className='cart-container'>
        <span className='number-of-items-in-cart'>{itemsInCart}</span>
        <Cart/>
    </div>
  )
}

export default CartWithNumer