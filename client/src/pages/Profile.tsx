/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil, Plus } from 'lucide-react';

import axios from '@/axios';
import { useAuth } from '@/context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MAX_HEIGHT, MAX_SIZE_BYTES, MAX_WIDTH } from '@/lib/utils';

const bioSchema = z.object({
  bio: z.string().max(500, 'Bio must not exceed 500 characters'),
});

type BioFormValues = z.infer<typeof bioSchema>;

const videoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters'),
  // file: z
  //   .custom<File>((file) => file instanceof File, {
  //     message: 'Input is not a valid file',
  //   })
  //   .refine((file) => file.size <= 6 * 1024 * 1024, {
  //     message: 'File size should be less than 6 MB',
  //   })
  //   .refine(
  //     (file) => ['video/mp4', 'video/webm', 'video/ogg'].includes(file.type),
  //     {
  //       message: 'Only video files (mp4, webm, ogg) are allowed',
  //     }
  //   ),
});

type VideoFormValues = z.infer<typeof videoSchema>;

interface Video {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  createdAt: string;
  videoUrl: string;
}

// interface User {
//   _id: string; // Unique identifier for the user
//   firstName: string; // First name of the user
//   lastName: string; // Last name of the user
//   mobile: string; // Mobile number of the user
//   email: string; // Email address of the user
//   status: 'active' | 'inactive' | 'blocked'; // Status of the user
//   bio: string;
// }

export default function Profile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  // const [user, setUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  // const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState('');
  const {
    register: registerBio,
    handleSubmit: handleSubmitBio,
    formState: { errors: bioErrors },
  } = useForm<BioFormValues>({
    resolver: zodResolver(bioSchema),
  });

  const {
    register: registerVideo,
    handleSubmit: handleSubmitVideo,
    formState: { errors: videoErrors },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
  });
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data } = await axios.get('/post/my-posts');
        setVideos(data.postList);
      } catch (e) {
        console.log(e);
      }
    }
    fetchPost();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_SIZE_BYTES) {
        toast.error('File size should be less than 1 MB.');
        return;
      }

      // using image reader
      const img = new Image();
      img.onload = () => {
        if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
          toast.error('Image dimensions should be less than 500x500 pixels.');
        } else {
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfileImage(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleBioUpdate = async (data: BioFormValues) => {
    console.log('Bio update data:', data);
    // update-profile
    try {
      setLoading(true);
      console.log('data', data);
      const res = await axios.patch('/user/update-profile', data);
      console.log('res.data', res.data);
      toast.success(res.data.message);
      // navigate('/profile');
      // setLoading(false);
      window.location.reload();
    } catch (e: any) {
      console.log(e);
      toast.error(e?.response?.data?.message || e.message);
      setLoading(false);
    }
  };

  const handleAddVideo = async (data: VideoFormValues) => {
    const file = fileInputRef.current?.files?.[0];

    if (file) {
      if (file.size > MAX_SIZE_BYTES * 6) {
        toast.error('File size should be less than 6 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setVideo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    await axios.post('/post/create-post', {
      title: data.title,
      description: data.description,
      videoUrl: video,
    });
    setVideos([
      ...videos,
      {
        title: data.title,
        description: data.description,
        videoUrl: video,
        _id: '',
        thumbnail: '',
        createdAt: ` `,
      },
    ]);
  };

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex flex-col md:flex-row gap-8'>
          <div className='md:w-1/2 lg:w-1/3 w-full'>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your personal information.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  <div className='flex items-center justify-center'>
                    <div className='relative'>
                      <Avatar className='w-24 h-24'>
                        <AvatarImage src={profileImage || ''} alt='Profile' />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Label
                        htmlFor='profile-image'
                        className='absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer'
                      >
                        <Pencil className='w-4 h-4' />
                        <Input
                          id='profile-image'
                          type='file'
                          accept='image/*'
                          className='hidden'
                          onChange={handleImageUpload}
                        />
                      </Label>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='firstName'>First Name</Label>
                    <Input id='firstName' value={user?.firstName} disabled />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='lastName'>Last Name</Label>
                    <Input id='lastName' value={user?.lastName} disabled />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      value={user?.email}
                      disabled
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='mobile'>Mobile</Label>
                    <Input id='mobile' value={user?.mobile} disabled />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='bio'>Bio</Label>
                    <p className='text-sm text-gray-600'>{user?.bio}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant='outline'>Edit Bio</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Bio</DialogTitle>
                          <DialogDescription>
                            Update your bio here. Click save when you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitBio(handleBioUpdate)}>
                          <div className='space-y-4'>
                            <div className='space-y-2'>
                              <Label htmlFor='bio'>Bio</Label>
                              <Textarea
                                id='bio'
                                {...registerBio('bio')}
                                defaultValue='I am a video content creator passionate about technology and education.'
                                rows={4}
                              />
                              {bioErrors.bio && (
                                <p className='text-sm text-red-500'>
                                  {bioErrors.bio.message}
                                </p>
                              )}
                            </div>
                          </div>
                          <DialogFooter className='mt-4'>
                            <Button type='submit' disabled={loading}>
                              Save Bio
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='w-full'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle>Your Videos</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size='sm'>
                      <Plus className='w-4 h-4 mr-2' />
                      Add Video
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Video</DialogTitle>
                      <DialogDescription>
                        Upload a new video (max 6MB) and provide details.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitVideo(handleAddVideo)}>
                      <div className='space-y-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='title'>Title</Label>
                          <Input id='title' {...registerVideo('title')} />
                          {videoErrors.title && (
                            <p className='text-sm text-red-500'>
                              {videoErrors.title.message}
                            </p>
                          )}
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='description'>Description</Label>
                          <Textarea
                            id='description'
                            {...registerVideo('description')}
                            rows={4}
                          />
                          {videoErrors.description && (
                            <p className='text-sm text-red-500'>
                              {videoErrors.description.message}
                            </p>
                          )}
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='file'>Video File (Max 6MB)</Label>
                          <Input
                            id='file'
                            type='file'
                            accept='video/*'
                            // {...registerVideo('file')}
                            required
                            ref={fileInputRef}
                          />
                          {/* {videoErrors.file && (
                            <p className='text-sm text-red-500'>
                              {videoErrors.file.message}
                            </p>
                          )} */}
                        </div>
                      </div>
                      <DialogFooter className='mt-4'>
                        <Button type='submit'>Upload Video</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {videos.map((video) => (
                    <div key={video._id} className='flex space-x-4'>
                      <video
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0; // Reset the video to the start
                        }}
                        className='w-32 h-24 object-cover rounded'
                      >
                        <source src={video.videoUrl} type='video/mp4' />
                      </video>
                      <div className='flex-grow'>
                        <h3 className='text-lg font-semibold'>{video.title}</h3>
                        <p className='text-sm text-gray-600'>
                          {video.description}
                        </p>
                        <p className='text-xs text-gray-400 mt-1'>
                          Uploaded on{' '}
                          {new Date(video.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
