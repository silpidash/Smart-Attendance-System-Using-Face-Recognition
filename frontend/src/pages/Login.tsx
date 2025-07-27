
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Shield, Sparkles, User, Lock, AtSign } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['admin', 'student', 'staff'], { 
    required_error: 'Please select a role' 
  })
});

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'student'
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await login(values.email, values.password, values.role as UserRole);
  };
  // const loginHandler = async

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full mb-4 shadow-3d">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="gradient-text">Smart Attendance System</span>
          </h1>
          <p className="text-gray-600 mt-2">Sign in to access your account</p>
        </div>

        <Card className="border-none shadow-3d card-3d">
          <CardHeader>
            <CardTitle className="text-2xl gradient-text">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input placeholder="your.email@example.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pl-10"
                            {...field} 
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="glass-effect">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-primary" />
                              <span>Administrator</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="student">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-primary" />
                              <span>Student</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="staff">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-primary" />
                              <span>Staff</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <Button 
                  type="submit" 
                  className="w-full mt-6 button-3d bg-gradient-to-r from-primary to-accent" 
                  disabled={isLoading}
                  // onClick = {loginHandler}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
          {/* <CardFooter className="flex justify-center border-t pt-6">
            <div className="text-sm text-gray-500">
              <p>Demo credentials:</p>
              <div className="flex flex-wrap gap-4 mt-2 text-xs">
                <div className="flex flex-col">
                  <span className="font-semibold">Admin:</span>
                  <span>admin@example.com</span>
                  <span>password</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Student:</span>
                  <span>student@example.com</span>
                  <span>password</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Staff:</span>
                  <span>staff@example.com</span>
                  <span>password</span>
                </div>
              </div>
            </div>
          </CardFooter> */}
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Smart Attendance System</p>
          <p className="mt-1">Powered by Spring Boot, Python & MySQL</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
