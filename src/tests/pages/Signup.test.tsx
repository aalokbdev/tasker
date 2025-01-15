import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../../pages/Auth/SignUp'; // Adjust the import path as necessary
import '@testing-library/jest-dom';
import { apiSignup } from '../../services/api';

// Mocking the apiSignup function
jest.mock('../../services/api', () => ({
  apiSignup: jest.fn(),
}));

describe('Signup Component', () => {
  beforeEach(() => {
    apiSignup.mockReset();
  });

  test('renders the Signup form', () => {
    render(<Signup />);

    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter role')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  test('updates form fields correctly on change', () => {
    render(<Signup />);

    const nameInput = screen.getByPlaceholderText('Enter name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const roleInput = screen.getByPlaceholderText('Enter role');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(roleInput, { target: { value: 'User' } });

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('johndoe@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(roleInput).toHaveValue('User');
  });

  test('calls apiSignup function with form data when form is submitted successfully', async () => {
    apiSignup.mockResolvedValueOnce({});

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText('Enter name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'johndoe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter role'), { target: { value: 'User' } });

    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() =>
      expect(apiSignup).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'User',
      })
    );
  });

  test('displays success message on successful signup', async () => {
    apiSignup.mockResolvedValueOnce({});

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText('Enter name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'johndoe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter role'), { target: { value: 'User' } });

    fireEvent.click(screen.getByText('Signup'));

    await screen.findByText('Signup successful! Please log in.');
  });

  test('displays error message on failed signup', async () => {
    apiSignup.mockRejectedValueOnce(new Error('Signup failed'));

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText('Enter name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'johndoe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter role'), { target: { value: 'User' } });

    fireEvent.click(screen.getByText('Signup'));

    await screen.findByText('Signup failed. Please try again.');
  });

  test('does not submit if any form field is empty', () => {
    render(<Signup />);

    fireEvent.click(screen.getByText('Signup'));

    expect(apiSignup).not.toHaveBeenCalled();
  });
});
