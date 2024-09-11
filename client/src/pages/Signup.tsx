/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import axios from '@/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setLoading(true);
      const res = await axios.post('/user/register', data);
      reset();
      toast.success(res.data.message);
    } catch (e: any) {
      console.log(e);
      toast.error(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                id='firstName'
                {...register('firstName')}
                placeholder='Enter your first name'
              />
              {errors.firstName && (
                <p className='text-xs text-red-500'>
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                id='lastName'
                {...register('lastName')}
                placeholder='Enter your last name'
              />
              {errors.lastName && (
                <p className='text-xs text-red-500'>
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                {...register('email')}
                placeholder='Enter your email'
              />
              {errors.email && (
                <p className='text-xs text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='mobile'>Mobile</Label>
              <Input
                id='mobile'
                {...register('mobile')}
                placeholder='Enter your mobile number'
              />
              {errors.mobile && (
                <p className='text-xs text-red-500'>{errors.mobile.message}</p>
              )}
            </div>
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'loading..' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        {/* <CardFooter>
          {signupError && (
            <Alert variant='destructive'>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{signupError}</AlertDescription>
            </Alert>
          )}
        </CardFooter> */}
      </Card>
    </div>
  );
}
