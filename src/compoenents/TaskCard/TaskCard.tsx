import React from 'react';
import './taskcard.css';

// Define the types for props
interface Task {
  _id: string;
  title: string;
  status: string;
  deadline: string;
  description?: string;
  assignedTo?: { name: string };
}

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
  handleShowUpdateModal: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete, isAdmin, handleShowUpdateModal, handleUpdateRole }) => {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>Status: {task.status}</p>
      <p>Deadline: {task.deadline}</p>
      <p>Description: {task?.description}</p>
      {isAdmin && task?.assignedTo && (
         <div className='update-cont'>
           <p>User: {task?.assignedTo?.name}</p>
           <button className="update-btn" onClick={() => handleUpdateRole(task.assignedTo)}>
          Update Role
        </button>
          </div>
            )}
     

      <div className="admin-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="action-btn" onClick={() => handleShowUpdateModal(task)}>
          Update Task
        </button>
        <button className="action-btn" onClick={() => onDelete(task._id)}>
          Delete Task
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
