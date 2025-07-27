// 'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { UserRole } from '@/contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Edit, Trash2, User, School, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from 'axios';

// Mock data
const mockStudents = [
  {
    id: 'student-1',
    name: 'John Doe',
    email: 'student@example.com',
    role: 'student' as UserRole,
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=22c55e&color=fff',
  },
  {
    id: 'student-2',
    name: 'Alice Smith',
    email: 'alice@example.com',
    role: 'student' as UserRole,
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Alice+Smith&background=22c55e&color=fff',
  },
];

const mockStaff = [
  {
    id: 'staff-1',
    name: 'Jane Smith',
    email: 'staff@example.com',
    role: 'staff' as UserRole,
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=f59e0b&color=fff',
  },
  {
    id: 'staff-2',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    role: 'staff' as UserRole,
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Johnson&background=f59e0b&color=fff',
  },
];

// Schema
const userFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  role: z.enum(['student', 'staff']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  avatar: z.string().min(1, 'Photo is required'),
});

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'student',
      password: '',
      avatar: '',
    },
  });

  const filteredStudents = mockStudents.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaff = mockStaff.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = async (values: z.infer<typeof userFormSchema>) => {
    try {
      const payload = {
        username: values.name,
        email: values.email,
        password: values.password,
        role: values.role.toUpperCase(),
      };

      const res = await axios.post('http://localhost:8081/register', payload);

      if (res.status === 200 || res.status === 201) {
        toast.success('User created successfully');
        setIsCreateDialogOpen(false);
        form.reset();
        setAvatarPreview(null);
      }
    } catch (err: any) {
      toast.error('Registration failed', {
        description: err?.response?.data?.message || 'Something went wrong.',
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Please upload an image smaller than 5MB.',
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', {
          description: 'Only image files are allowed.',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        form.setValue('avatar', base64);
        setAvatarPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-1" /> Create User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Fill in the user details including a clear face photo for recognition.</DialogDescription>
            </DialogHeader>

            <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 mb-4">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Facial Recognition</AlertTitle>
              <AlertDescription>Photo must be a clear, well-lit front-facing image.</AlertDescription>
            </Alert>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative group">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarPreview || ''} />
                      <AvatarFallback>
                        {form.watch('name')?.[0]?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer">
                      <label htmlFor="avatar-upload" className="text-white text-xs cursor-pointer">Upload</label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>
                </div>
                {!avatarPreview && <p className="text-xs text-center text-red-500">* Photo is required</p>}
                
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">
                          <School className="w-4 h-4 mr-2" /> Student
                        </SelectItem>
                        <SelectItem value="staff">
                          <User className="w-4 h-4 mr-2" /> Staff
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" className="w-full">Submit</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="students">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((user) => (
              <Card key={user.id}>
                <CardHeader className="flex flex-row gap-4 items-center">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="staff">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStaff.map((user) => (
              <Card key={user.id}>
                <CardHeader className="flex flex-row gap-4 items-center">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
