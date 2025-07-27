import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  CalendarClock, 
  Calendar, 
  Clock, 
  Users, 
  UserCheck, 
  BookOpen, 
  School,
  AlertTriangle
} from 'lucide-react';
import AttendanceMarker from '@/components/attendance/AttendanceMarker';

// Mock dashboard data
const mockData = {
  admin: {
    stats: {
      students: 1245,
      staff: 98,
      attendanceToday: 86,
      pendingRequests: 12
    },
    recentActivity: [
      { user: 'Jane Smith', action: 'Marked attendance', time: '2 minutes ago' },
      { user: 'John Doe', action: 'Requested leave', time: '25 minutes ago' },
      { user: 'Admin User', action: 'Approved leave for Sarah Johnson', time: '1 hour ago' },
      { user: 'Mike Johnson', action: 'Marked late attendance', time: '2 hours ago' },
      { user: 'Admin User', action: 'Added new student accounts', time: '3 hours ago' }
    ]
  },
  student: {
    attendanceStats: {
      current: 92,
      total: 110,
      percentage: 84
    },
    todayClasses: [
      { subject: 'Advanced Mathematics', time: '09:00 - 10:30', location: 'Room 201', teacher: 'Dr. Smith' },
      { subject: 'Computer Science', time: '11:00 - 12:30', location: 'Lab 101', teacher: 'Prof. Johnson' },
      { subject: 'Physics', time: '14:00 - 15:30', location: 'Room 305', teacher: 'Dr. Williams' }
    ]
  },
  staff: {
    attendanceStats: {
      current: 65,
      total: 68,
      percentage: 96
    },
    todaySchedule: [
      { class: 'Computer Science 101', time: '09:00 - 10:30', location: 'Lab 101', type: 'Lecture' },
      { class: 'Office Hours', time: '11:00 - 13:00', location: 'Office 305', type: 'Consultation' },
      { class: 'Advanced Programming', time: '14:00 - 15:30', location: 'Lab 102', type: 'Lab' }
    ]
  }
};

const Dashboard = () => {
  const { user, markAttendance } = useAuth();
  
  const handleAttendanceMarked = () => {
    console.log("Mark Attendence ", user.email)
    markAttendance(user.email);
  };

  const renderAdminDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Stats Cards */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <School className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Students</p>
              <h3 className="text-2xl font-bold">{mockData.admin.stats.students}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
              <h3 className="text-2xl font-bold">{mockData.admin.stats.staff}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <UserCheck className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today's Attendance</p>
              <h3 className="text-2xl font-bold">{mockData.admin.stats.attendanceToday}%</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
              <h3 className="text-2xl font-bold">{mockData.admin.stats.pendingRequests}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockData.admin.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start">
                <div className="mr-4 mt-0.5">
                  <div className="flex h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">View All Activity</Button>
        </CardFooter>
      </Card>

      {/* Quick Actions */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => window.location.href = '/users'}>
              <Users className="h-5 w-5" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Manage Calendar</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>Edit Timetable</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
              <UserCheck className="h-5 w-5" />
              <span>View Attendance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Student Attendance Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>My Attendance</CardTitle>
          <CardDescription>Current semester overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Attendance Rate</p>
              <p className="text-sm font-medium">{mockData.student.attendanceStats.percentage}%</p>
            </div>
            <Progress value={mockData.student.attendanceStats.percentage} className="h-2" />
          </div>
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium">Classes Attended</p>
            <p className="text-2xl font-bold">
              {mockData.student.attendanceStats.current} 
              <span className="text-sm text-muted-foreground font-normal"> of {mockData.student.attendanceStats.total}</span>
            </p>
          </div>
          <div className="pt-4">
            <p className="text-sm font-medium mb-3">Today's Status:</p>
            <AttendanceMarker 
              onAttendanceMarked={handleAttendanceMarked}
              isAttendanceMarked={!!user?.isPresent}
            />
          </div>
        </CardContent>
      </Card>

      {/* Today's Classes */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Classes</CardTitle>
          <CardDescription>Your schedule for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.student.todayClasses.map((classItem, i) => (
              <div key={i} className="flex border rounded-lg p-3 card-hover">
                <div className="mr-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{classItem.subject}</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{classItem.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      <span>{classItem.teacher}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground col-span-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{classItem.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            View Full Timetable
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  const renderStaffDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Staff Attendance Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>My Attendance</CardTitle>
          <CardDescription>This month overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Attendance Rate</p>
              <p className="text-sm font-medium">{mockData.staff.attendanceStats.percentage}%</p>
            </div>
            <Progress value={mockData.staff.attendanceStats.percentage} className="h-2" />
          </div>
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium">Days Present</p>
            <p className="text-2xl font-bold">
              {mockData.staff.attendanceStats.current} 
              <span className="text-sm text-muted-foreground font-normal"> of {mockData.staff.attendanceStats.total}</span>
            </p>
          </div>
          <div className="pt-4">
            <p className="text-sm font-medium mb-3">Today's Status:</p>
            <AttendanceMarker 
              onAttendanceMarked={handleAttendanceMarked}
              isAttendanceMarked={!!user?.isPresent}
            />
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Your teaching plan for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.staff.todaySchedule.map((scheduleItem, i) => (
              <div key={i} className="flex border rounded-lg p-3 card-hover">
                <div className="mr-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CalendarClock className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{scheduleItem.class}</h4>
                  <p className="text-xs text-muted-foreground">{scheduleItem.type}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{scheduleItem.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{scheduleItem.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            View Full Schedule
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
  console.log("Rendering Admin Dashboard", user?.role?.replace('ROLE_', '').toLowerCase());
  return (
    
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {user?.role?.replace('ROLE_', '').toLowerCase() === 'admin' && renderAdminDashboard()}
      {user?.role?.replace('ROLE_', '').toLowerCase() === 'student' && renderStudentDashboard()}
      {user?.role?.replace('ROLE_', '').toLowerCase() === 'staff' && renderStaffDashboard()}
    </div>
  );
};

export default Dashboard;
