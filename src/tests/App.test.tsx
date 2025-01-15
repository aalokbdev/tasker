import React from 'react'; 
import { render, screen } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import App from '../App';  // Adjust the import path as needed

// Mock the components that are used in App to avoid real routing and context logic
jest.mock('../components/Navbar/Navbar', () => () => <div>Navbar Component</div>);
jest.mock('../components/PrivateRoute', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock('../pages/TaskDashboard/TaskDashboard', () => () => <div>TaskDashboard Page</div>);
jest.mock('../pages/Auth/Login', () => () => <div>Login Page</div>);
jest.mock('../pages/Auth/SignUp', () => () => <div>Signup Page</div>);

describe('App Component', () => {
  it('renders Navbar component', () => {
    render(
      <Router>
        <App />
      </Router>
    );
    expect(screen.getByText(/Navbar Component/)).toBeInTheDocument();
  });

  it('renders Login page on "/" route', () => {
    render(
      <Router initialEntries={['/']}>
        <App />
      </Router>
    );
    expect(screen.getByText(/Login Page/)).toBeInTheDocument();
  });

  it('renders Signup page on "/signup" route', () => {
    render(
      <Router initialEntries={['/signup']}>
        <App />
      </Router>
    );
    expect(screen.getByText(/Signup Page/)).toBeInTheDocument();
  });

  it('renders TaskDashboard for "/user" route with PrivateRoute and role User', () => {
    render(
      <Router initialEntries={['/user']}>
        <App />
      </Router>
    );
    expect(screen.getByText(/TaskDashboard Page/)).toBeInTheDocument();
  });

  it('renders TaskDashboard for "/admin" route with PrivateRoute and role Admin', () => {
    render(
      <Router initialEntries={['/admin']}>
        <App />
      </Router>
    );
    expect(screen.getByText(/TaskDashboard Page/)).toBeInTheDocument();
  });
});
