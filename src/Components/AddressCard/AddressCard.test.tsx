import { render, screen } from '@testing-library/react';
import AddressCard from './index';
import { Address } from '../../types';

describe('AddressCard Component', () => {
  const mockAddress: Address = {
    addressLine1: '1234 Elm St',
    addressLine2: 'Apt 567',
    city: 'Springfield',
    pin: '12345',
    state: 'IL',
    country: 'USA',
    receiverName: 'John Doe', // Ensure this matches the exact case
    isSelected: false,
    id: '1',
  };

  it('renders the address correctly', () => {
    render(<AddressCard {...mockAddress} />);

    // Assert the receiver's name is rendered (case-sensitive)
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Assert the full address is rendered (case-sensitive)
    expect(screen.getByText("1234 Elm St")).toBeInTheDocument();
    expect(screen.getByText("Springfield, IL, 12345, USA")).toBeInTheDocument();
  });

  it('applies "address-selected" class when isSelected is true', () => {
    render(<AddressCard {...mockAddress} isSelected={true} />);

    // Assert the container has 'address-selected' class
    const addressContainer = screen.getByText("John Doe").closest('.full-address');
    expect(addressContainer).toHaveClass('address-selected');
  });

  it('does not apply "address-selected" class when isSelected is false', () => {
    render(<AddressCard {...mockAddress} isSelected={false} />);

    // Assert the container does not have 'address-selected' class
    const addressContainer = screen.getByText("John Doe").closest('.full-address');
    expect(addressContainer).not.toHaveClass('address-selected');
  });

  it('renders without addressLine2 when not provided', () => {
    const addressWithoutAddressLine2 = { ...mockAddress, addressLine2: '' };
    render(<AddressCard {...addressWithoutAddressLine2} />);

    // Assert addressLine2 is not rendered
    expect(screen.queryByText(", Apt 567")).not.toBeInTheDocument();
  });
});
