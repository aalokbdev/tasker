import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.REACT_APP_BASE_URL as string;


// Define types for the API data structures
interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface User{
  id: string;
}

interface TaskUpdates {
  title?: string;
  description?: string;
  completed?: boolean;
}

// API functions
export const apiLogin = async (credentials: LoginCredentials): Promise<{ token: string }> => {
  try {
    const response = await axios.post<{ token: string }>(
      `${API_BASE_URL}users/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get<Task[]>(`${API_BASE_URL}tasks`, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Fetching tasks failed:", error);
    throw error;
  }
};

export const createTask = async (taskData: Omit<Task, "id">): Promise<Task> => {
  try {
    const response = await axios.post<Task>(`${API_BASE_URL}tasks`, taskData, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Creating task failed:", error);
    throw error;
  }
};

export const updateTask = async (id: string, updates: TaskUpdates): Promise<Task> => {
  try {
    const response = await axios.put<Task>(`${API_BASE_URL}tasks/${id}`, updates, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Updating task failed:", error);
    throw error;
  }
};


export const updateUserRole = async (id: any): Promise<User> => {
  try {
    const response = await axios.post<Task>(`${API_BASE_URL}tasks/role`, { id: id._id },{
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Updating task failed:", error);
    throw error;
  }
};



export const deleteTask = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${API_BASE_URL}tasks/${id}`,
      {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Deleting task failed:", error);
    throw error;
  }
};

export const apiSignup = async (formData: SignupFormData): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_BASE_URL}users/register`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

export const fetchAllUsers = async (): Promise<any[]> => {
  try {
    const response = await axios.get<any[]>(`${API_BASE_URL}users`, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Fetching users failed:", error);
    throw error;
  }
};

export const fetchUserTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get<Task[]>(`${API_BASE_URL}tasks/user`, {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Fetching user tasks failed:", error);
    throw error;
  }
};
