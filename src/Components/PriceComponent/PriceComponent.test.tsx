import { render, screen } from '@testing-library/react';
import PriceComponent from './index';

describe('PriceComponent', () => {
  it('renders the original price when no discounted price is provided', () => {
    // Set up props
    const originalPrice = 1000;

    // Render the component
    render(<PriceComponent originalPrice={originalPrice} />);

    expect(screen.getByText(`₹ ${originalPrice}`)).toBeInTheDocument();
    expect(screen.queryByText('M.R.P')).not.toBeInTheDocument();
  });

  it('renders the discounted price and the original price with discount', () => {
    // Set up props
    const originalPrice = 1000;
    const discountedPrice = 800;

    // Render the component
    render(<PriceComponent originalPrice={originalPrice} discountedPrice={discountedPrice} />);

    expect(screen.getByText(`₹ ${discountedPrice}`)).toBeInTheDocument();

    expect(screen.getByText('M.R.P')).toBeInTheDocument();
    expect(screen.getByText(`₹${originalPrice}`)).toBeInTheDocument();

    const discountPercentage = Math.floor(((originalPrice - discountedPrice) / originalPrice) * 100);
    expect(screen.getByText(`(${discountPercentage}% off)`)).toBeInTheDocument();
  });

  it('renders original price when discounted price is 0', () => {
    // Set up props where the discounted price is explicitly 0
    const originalPrice = 1000;
    const discountedPrice = 0;

    render(<PriceComponent originalPrice={originalPrice} discountedPrice={discountedPrice} />);

    expect(screen.getByText(`₹ ${originalPrice}`)).toBeInTheDocument();

    expect(screen.queryByText('M.R.P')).not.toBeInTheDocument();
    expect(screen.queryByText('% off')).not.toBeInTheDocument();
  });
});
