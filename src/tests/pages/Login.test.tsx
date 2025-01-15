import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../pages/Auth/Login.tsx'; // Adjust the import path as necessary
import '@testing-library/jest-dom';
import { useAuth } from '../../context/AuthContext.tsx';

// Mocking the useAuth hook
jest.mock('../../context/AuthContext.tsx', () => ({
  useAuth: jest.fn(),
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    // Reset mocks and provide default mock return value
    jest.clearAllMocks();
    useAuth.mockReturnValue({ login: mockLogin });
  });

  test('renders the Login form', () => {
    render(<Login />);

    // Check for input fields and submit button
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('updates email and password fields on user input', () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    // Simulate typing into the fields
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('calls login function when form is submitted with valid input', async () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Login');

    // Enter valid credentials and submit the form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Ensure the login function is called with correct arguments
    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    );
  });

  test('displays an error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Login');

    // Enter incorrect credentials and submit
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    // Wait for and check the error message
    await waitFor(() =>
      expect(
        screen.getByText('Invalid username or password. Please try again.')
      ).toBeInTheDocument()
    );
  });

  test('does not display error message for successful login', async () => {
    mockLogin.mockResolvedValueOnce({});

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Login');

    // Enter valid credentials and submit
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Ensure no error message is displayed
    await waitFor(() =>
      expect(
        screen.queryByText('Invalid username or password. Please try again.')
      ).not.toBeInTheDocument()
    );
  });

  test('prevents submission if email or password is missing', () => {
    render(<Login />);

    const submitButton = screen.getByText('Login');

    // Attempt submission without input
    fireEvent.click(submitButton);

    // Ensure login function is not called
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
