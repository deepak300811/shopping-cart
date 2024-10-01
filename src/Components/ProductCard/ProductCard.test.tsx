import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './index';

describe('ProductCard Component', () => {
  const defaultProps = {
    stock: 10,
    name: 'Sample Product',
    description: 'Sample Description',
    discountedPrice: 800,
    originalPrice: 1000,
    id: '1',
    photoLink: 'https://m.media-amazon.com/images/I/71qdcxI6lDL._AC_UL640_FMwebp_QL65_.jpg',
    quantity: 0,
    onRemoveProduct: jest.fn(),
    isCheckoutPage: false,
    indexNumber: 0,
  };

  it('renders the product name, description, and price', () => {
    render(<ProductCard {...defaultProps} />);
    
    // Assert the name, description, and price are rendered
    expect(screen.getByText('Sample Product')).toBeInTheDocument();
    expect(screen.getByText('Sample Description')).toBeInTheDocument();
    expect(screen.getByText('₹ 800')).toBeInTheDocument();
  });

  it('renders the Add to Cart button if not on the checkout page', () => {
    render(<ProductCard {...defaultProps} />);

    // Assert the "Add to Cart" button is rendered
    expect(screen.getByText('Add to cart')).toBeInTheDocument();
  });

  it('does not render the Add to Cart button on the checkout page', () => {
    const props = { ...defaultProps, isCheckoutPage: true };
    render(<ProductCard {...props} />);

    // Assert the "Add to Cart" button is not rendered
    expect(screen.queryByText('Add to cart')).not.toBeInTheDocument();
  });

  it('renders quantity buttons when quantity > 0 and not on checkout page', () => {
    const props = { ...defaultProps, quantity: 2 };
    render(<ProductCard {...props} />);

    // Assert the quantity is displayed and remove buttons are rendered
    expect(screen.getByText('2 in cart -')).toBeInTheDocument();
    expect(screen.getByText('Remove 1')).toBeInTheDocument();
    expect(screen.getByText('Remove All')).toBeInTheDocument();
  });

  it('calls onRemoveProduct when "Remove 1" button is clicked', () => {
    const props = { ...defaultProps, quantity: 2 };
    render(<ProductCard {...props} />);

    const removeOneButton = screen.getByText('Remove 1');
    
    // Simulate clicking the "Remove 1" button
    fireEvent.click(removeOneButton);

    // Assert that the onRemoveProduct function was called with correct arguments
    expect(props.onRemoveProduct).toHaveBeenCalledWith(0, 'ONE');
  });

  it('calls onRemoveProduct when "Remove All" button is clicked', () => {
    const props = { ...defaultProps, quantity: 2 };
    render(<ProductCard {...props} />);

    const removeAllButton = screen.getByText('Remove All');

    // Simulate clicking the "Remove All" button
    fireEvent.click(removeAllButton);

    // Assert that the onRemoveProduct function was called with correct arguments
    expect(props.onRemoveProduct).toHaveBeenCalledWith(0, 'ALL');
  });
});
