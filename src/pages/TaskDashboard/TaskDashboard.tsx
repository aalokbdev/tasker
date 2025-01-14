import React, { useState, useEffect, ChangeEvent } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import TaskCard from '../../compoenents/TaskCard/TaskCard.tsx';
import './taskdashboard.css';
import { fetchTasks, createTask, updateTask, deleteTask, fetchAllUsers, fetchUserTasks, updateUserRole } from '../../services/api.ts';
import ModalComponent from '../../compoenents/Modal/Modal.tsx';
import Form from 'react-bootstrap/Form';

// Types for task, user, and task details
interface Task {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
  assignedTo: {
    name: string;
  };
}

interface ApiResponse<T> {
    data: any;
  }

interface User {
  role: string;
  userId: string;
  id: string;
}

interface TaskDetails {
  title: string;
  description: string;
  deadline: string;
  status: string;
  assignedTo: string;
}

interface TaskDashboardProps {}

const TaskDashboard: React.FC<TaskDashboardProps> = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState<{ create: boolean; update: boolean }>({
    create: false,
    update: false,
  });
  const [taskDetails, setTaskDetails] = useState<TaskDetails>({
    title: '',
    description: '',
    deadline: '',
    status: '',
    assignedTo: '',
  });
  const [taskId, setTaskId] = useState<string>('');
  const [userTaskslist, setUserTasksList] = useState<Task[]>([]);

const loadTasks = async () => {
  try {
    const response = await fetchTasks();
    setTasks(response?.data);  // 'data' is now correctly typed as Task[]
  } catch (err) {
    setError('Failed to load tasks.');
  }
};

const loadUsers = async () => {
  try {
    const response = await fetchAllUsers();
    setUsers(response?.data);  
  } catch (err) {
    setError('Failed to load users.');
  }
};

const userTasks = async () => {
  try {
    const response = await fetchUserTasks();
    setUserTasksList(response?.data);  
  } catch (error) {
    setError('Failed to load user tasks.');
  }
};

  useEffect(() => {
    loadTasks();
    loadUsers();
    userTasks();
  }, []);

  const handleSubmitModal = async () => {
    try {
      if (show.create) {
        const createdTask = await createTask(taskDetails);
        if (createdTask?.success) {
          setShow((prev) => ({
            ...prev,
            create: false,
          }));
          loadTasks();
          userTasks();
          setTaskDetails({
            title: '',
            description: '',
            deadline: '',
            status: '',
            assignedTo: '',
          });
          return alert('Task created successfully');
        }
      } else {
        const updatedTask = await updateTask(taskId, taskDetails);
        if (updatedTask?.success) {
          setShow((prev) => ({
            ...prev,
            update: false,
          }));
          loadTasks();
          userTasks();
          setTaskDetails({
            title: '',
            description: '',
            deadline: '',
            status: '',
            assignedTo: '',
          });
          return alert('Task updated successfully');
        }
      }
    } catch (err) {
      setError('Failed to create or update task.');
    }
  };

  const handleUpdateRole = async(id: string) => {
    try {
      const updateRole = await updateUserRole(id);
      console.log('updateRole',updateRole);
      if (updateRole?.success) {
        userTasks();
        loadTasks();
        return alert('User role updated successfully');
      }
    } catch (error) {
      setError('Failed to update task.');
    }
  }

  const handleUpdateTask = async (taskId: string, statusValue: string) => {
    try {
      const updatedTask = await updateTask(taskId, statusValue);
      if (updatedTask?.success) {
        userTasks();
        return alert('Task status updated successfully');
      }
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const removedTask = await deleteTask(taskId);
      if (removedTask?.success) {
        loadTasks();
        userTasks();
        alert('Task deleted successfully');
      }
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const handleShowModal = async (role: string) => {
    setShow((prev) => ({
      ...prev,
      create: true,
    }));
  };

  const handleCollectTaskDetails = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (user?.role === 'User') {
      setTaskDetails((prev) => ({
        ...prev,
        [name]: value,
        assignedTo: user?.userId,
      }));
    } else {
      setTaskDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleShowUpdateModal = (task: Task) => {
    setTaskId(task._id);
    setTaskDetails({
      title: task?.title,
      status: task?.status,
      description: task?.description,
      deadline: task?.deadline,
      assignedTo: user?.role === 'Admin' ? task?.assignedTo._id : user?.id,
    });
    setShow((prev) => ({
      ...prev,
      update: true,
    }));
  };

  const formatDeadline = (isoDate: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0]; // Extract only the date part
  };

  const renderAdminPanel = () => (
    <div className="admin-panel">
      <h3 style={{margin:"1rem"}}>Admin Panel</h3>
      <>{renderUI()}</>
    </div>
  );

  const renderUI = () => {
    return (
      <>
        {user && user.role === 'User' ? (
          <>
             <div className='header-cont'>
             <h2>User Panel</h2>
            <button className="action-btn" onClick={() => handleShowModal('User')}>
              Create New Task
            </button>

             </div>
            <div className="task-list">
              {userTaskslist?.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  isAdmin={false}
                  handleShowUpdateModal={handleShowUpdateModal}
                />
              ))}

              <ModalComponent
                show={show.create ? show.create : show.update}
                setShow={setShow}
                title={show.create ? 'Create Task' : 'Update task'}
                hansleSubmitModal={handleSubmitModal}
              >
                <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="title...."
                      autoFocus
                      name="title"
                      onChange={handleCollectTaskDetails}
                      value={taskDetails?.title || ''}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="description...."
                      autoFocus
                      name="description"
                      onChange={handleCollectTaskDetails}
                      value={taskDetails?.description || ''}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Date"
                      autoFocus
                      name="deadline"
                      onChange={handleCollectTaskDetails}
                      value={formatDeadline(taskDetails?.deadline || '')}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="status"
                      onChange={handleCollectTaskDetails}
                      value={taskDetails?.status || ''}
                    >
                      <option>Status</option>
                      <option value="Pending">Pending</option>
                      <option value="InProgress">InProgress</option>
                      <option value="Completed">Complete</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              </ModalComponent>
            </div>
          </>
        ) : (
          <>
            <div>
              <button className="action-btn" style={{marginLeft:"1rem"}} onClick={() => handleShowModal('Admin')}>
                Create New Task
              </button>

              <div className="task-list">
                {tasks?.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    isAdmin={user?.role === 'Admin'}
                    handleShowUpdateModal={handleShowUpdateModal}
                    handleUpdateRole={handleUpdateRole}
                  />
                ))}
              </div>

              <ModalComponent
                show={show.create ? show.create : show.update}
                setShow={setShow}
                title={show.create ? 'Create Task' : 'Update task'}
                hansleSubmitModal={handleSubmitModal}
              >
                <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="title...."
                      autoFocus
                      name="title"
                      onChange={handleCollectTaskDetails}
                      value={taskDetails?.title || ''}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="description...."
                      autoFocus
                      name="description"
                      onChange={handleCollectTaskDetails}
                      value={taskDetails?.description || ''}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Date"
                      autoFocus
                      name="deadline"
                      onChange={handleCollectTaskDetails}
                      value={formatDeadline(taskDetails?.deadline || '')}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="status"
                      onChange={handleCollectTaskDetails}
                      value={taskDetails?.status || ''}
                    >
                      <option>Status</option>
                      <option value="Pending">Pending</option>
                      <option value="InProgress">InProgress</option>
                      <option value="Completed">Complete</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                      <Form.Label>Assigned to</Form.Label>
                      <Form.Select aria-label="Default select example" name='assignedTo' onChange={handleCollectTaskDetails}  value={taskDetails?.assignedTo || ''}
                      >

                        {
                          users?.map((usr) => {
                            return (
                              <option value={usr?._id} >{usr?.name}</option>
                            )
                          })
                        }
                      </Form.Select>
                    </Form.Group>
                </Form>
              </ModalComponent>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div>
      {user && user.role === 'Admin' ? renderAdminPanel() : renderUI()}
    </div>
  );
};

export default TaskDashboard;
