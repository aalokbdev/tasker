import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../../components/TaskCard/TaskCard'; // Adjust the import path as necessary
import '@testing-library/jest-dom';

// Mock task and functions
const task = {
  _id: '1',
  title: 'Test Task',
  status: 'Pending',
  deadline: '2025-01-13',
  description: 'This is a test task',
  assignedTo: { name: 'John Doe' },
};

const onUpdate = jest.fn();
const onDelete = jest.fn();
const handleShowUpdateModal = jest.fn();

describe('TaskCard Component', () => {
  test('displays task details correctly', () => {
    render(
      <TaskCard
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isAdmin={false}
        handleShowUpdateModal={handleShowUpdateModal}
      />
    );

    // Verify task details
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Status: Pending')).toBeInTheDocument();
    expect(screen.getByText('Deadline: 2025-01-13')).toBeInTheDocument();
    expect(screen.getByText('Description: This is a test task')).toBeInTheDocument();
  });

  test('renders admin controls (Update and Delete buttons) when isAdmin is true', () => {
    render(
      <TaskCard
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isAdmin={true}
        handleShowUpdateModal={handleShowUpdateModal}
      />
    );

    expect(screen.getByText('Update Task')).toBeInTheDocument();
    expect(screen.getByText('Delete Task')).toBeInTheDocument();
  });

  test('hides admin controls when isAdmin is false', () => {
    render(
      <TaskCard
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isAdmin={false}
        handleShowUpdateModal={handleShowUpdateModal}
      />
    );

    expect(screen.queryByText('Update Task')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete Task')).not.toBeInTheDocument();
  });

  test('calls onDelete when Delete button is clicked', () => {
    render(
      <TaskCard
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isAdmin={true}
        handleShowUpdateModal={handleShowUpdateModal}
      />
    );

    fireEvent.click(screen.getByText('Delete Task'));

    // Verify onDelete is called with the correct task ID
    expect(onDelete).toHaveBeenCalledWith(task._id);
  });

  test('calls handleShowUpdateModal when Update Task button is clicked', () => {
    render(
      <TaskCard
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isAdmin={true}
        handleShowUpdateModal={handleShowUpdateModal}
      />
    );

    fireEvent.click(screen.getByText('Update Task'));

    // Verify handleShowUpdateModal is called with the task object
    expect(handleShowUpdateModal).toHaveBeenCalledWith(task);
  });

  test('calls onUpdate when status dropdown is changed (non-admin)', () => {
    render(
      <TaskCard
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isAdmin={false}
        handleShowUpdateModal={handleShowUpdateModal}
      />
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'InProgress' } });

    // Verify onUpdate is called with the correct data
    expect(onUpdate).toHaveBeenCalledWith(task._id, { status: 'InProgress' });
  });

  test('hides status dropdown for completed tasks (non-admin)', () => {
    const completedTask = { ...task, status: 'Completed' };

    render(
      <TaskCard
        task={completedTask}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isAdmin={false}
        handleShowUpdateModal={handleShowUpdateModal}
      />
    );

    // Ensure status dropdown is not rendered
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  test('displays assigned user for admin', () => {
    render(
      <TaskCard
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isAdmin={true}
        handleShowUpdateModal={handleShowUpdateModal}
      />
    );

    // Verify assigned user is displayed
    expect(screen.getByText('User : John Doe')).toBeInTheDocument();
  });

  test('hides assigned user for non-admin', () => {
    render(
      <TaskCard
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isAdmin={false}
        handleShowUpdateModal={handleShowUpdateModal}
      />
    );

    // Ensure assigned user is not displayed
    expect(screen.queryByText('User : John Doe')).not.toBeInTheDocument();
  });
});
