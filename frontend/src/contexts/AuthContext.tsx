import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'student' | 'staff';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isPresent?: boolean;
  attendanceTime?: string;
  // token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  markAttendance: (email: string) => void;
}

const mockUsers = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin' as UserRole,
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff'
  },
  {
    id: 'student-1',
    name: 'John Doe',
    email: 'student@example.com',
    password: 'password',
    role: 'student' as UserRole,
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=22c55e&color=fff'
  },
  {
    id: 'staff-1',
    name: 'Jane Smith',
    email: 'staff@example.com',
    password: 'password',
    role: 'staff' as UserRole,
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=f59e0b&color=fff'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);

    try {
      // Simulate API call to authentication endpoint
      const apiHost = 'http://localhost:8081';

      const response = await fetch(`${apiHost}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const userDetails = await response.json();
      
      // Assuming userDetails contains the necessary information
      if (userDetails) {
        setUser(userDetails);
        localStorage.setItem('user', JSON.stringify(userDetails));
        
        toast.success(`Welcome back, ${userDetails.name}!`, {
          description: `Logged in as ${userDetails.role?.replace('ROLE_', '').toLowerCase()}`,
        });
        
        navigate('/dashboard');
      } else {
        toast.error('Authentication failed', {
          description: 'Invalid email, password, or role combination.',
        });
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      toast.error('Authentication failed', {
        description: 'An error occurred while trying to authenticate. Please try again later.',
      });
    }

    setIsLoading(false);
  };

  const markAttendance = async (email: string) => {
    if (!email) return;
  
    setIsLoading(true); // Optional: Add loading spinner
  
    try {
      const apiHost = 'http://localhost:8081';
  
      const response = await fetch(`${apiHost}/start-recognition?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("Response Code is : ",response)
      console.log("Response String : ",JSON.stringify({ email }))
  
      if (!response.ok) {
        throw new Error('Failed to start face recognition');
      }
  
      const data = await response.json();
  
      if (data.success) {
        const now = new Date();
        const attendanceTime = now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
  
        const updatedUser = {
          ...user,
          isPresent: true,
          attendanceTime,
        };
  
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
  
        toast.success(`Attendance marked for ${user?.name} at ${attendanceTime}`);
      } else {
        toast.error('Face recognition failed', {
          description: 'Could not recognize face. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error during attendance marking:', error);
      toast.error('Attendance marking failed', {
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred while trying to mark attendance.',
      });
    }
  
    setIsLoading(false);
  };
  
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, markAttendance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};