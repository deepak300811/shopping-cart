import { render, screen } from '@testing-library/react';
import CartWithNumer from './index';

describe('CartWithNumer Component', () => {
  it('renders the correct number of items in the cart', () => {
    // Set up props
    const itemsInCart = 5;

    render(<CartWithNumer itemsInCart={itemsInCart} />);

    // Assert the number of items is rendered correctly using the test id
    expect(screen.getByTestId('number-of-items')).toHaveTextContent(itemsInCart.toString());
  });

  it('renders the Cart icon', () => {
    // Set up props
    const itemsInCart = 3;

    render(<CartWithNumer itemsInCart={itemsInCart} />);

    expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
  });
});
