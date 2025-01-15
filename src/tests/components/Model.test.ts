import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalComponent from '../../components/Modal/Modal'; // Adjust the import according to your file structure

describe('ModalComponent', () => {
  // Mock functions with proper TypeScript types
  const mockSetShow = jest.fn() as jest.Mock<void, [boolean]>;
  const mockHandleSubmit = jest.fn() as jest.Mock<void, []>;

  test('renders the modal when show is true', () => {
    render(
      <ModalComponent
        show={true}
        setShow={mockSetShow}
        title="Test Modal"
        hansleSubmitModal={mockHandleSubmit}
      >
        <p>Modal Body Content</p>
      </ModalComponent>
    );

    // Check if the modal title and body content are displayed
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Body Content')).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    render(
      <ModalComponent
        show={false}
        setShow={mockSetShow}
        title="Test Modal"
        hansleSubmitModal={mockHandleSubmit}
      >
        <p>Modal Body Content</p>
      </ModalComponent>
    );

    // Check if modal is not rendered
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  test('closes the modal when Close button is clicked', () => {
    render(
      <ModalComponent
        show={true}
        setShow={mockSetShow}
        title="Test Modal"
        hansleSubmitModal={mockHandleSubmit}
      >
        <p>Modal Body Content</p>
      </ModalComponent>
    );

    // Click the Close button
    fireEvent.click(screen.getByText('Close'));

    // Verify if setShow is called with false
    expect(mockSetShow).toHaveBeenCalledWith(false);
  });

  test('calls hansleSubmitModal when Save Changes button is clicked', () => {
    render(
      <ModalComponent
        show={true}
        setShow={mockSetShow}
        title="Test Modal"
        hansleSubmitModal={mockHandleSubmit}
      >
        <p>Modal Body Content</p>
      </ModalComponent>
    );

    // Click the Save Changes button
    fireEvent.click(screen.getByText('Save Changes'));

    // Verify if the submit handler function is called
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
