import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import axios from '@/axios';

interface Video {
  _id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
}

interface UserDetails {
  bio: string;
  firstName: string;
  lastName: string;
  profile: string;
}

interface Feed {
  userId: string;
  latestPost: Video[];
  userDetails: UserDetails;
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [Feed, setFeed] = useState<Feed[]>([]);

  useEffect(() => {
    // Simulating an API call to fetch users and their videos
    const fetchUsers = async () => {
      try {
        // In a real application, this would be an API call
        const { data } = await axios.get('/post/all-posts');

        setFeed(data.postList);
        setLoading(false);
      } catch (err: any) {
        console.log(err);
        setError('Failed to fetch users and videos. Please try again later.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <div className='space-y-8'>
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <div className='flex items-center space-x-4'>
                  <Skeleton className='h-12 w-12 rounded-full' />
                  <Skeleton className='h-6 w-32' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                  {[...Array(5)].map((_, videoIndex) => (
                    <Skeleton key={videoIndex} className='h-48 w-full' />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <Card>
          <CardContent className='text-center py-8'>
            <p className='text-red-500'>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8 px-4'>
      <h1 className='text-3xl font-bold mb-8'>Video Feed</h1>
      <div className='space-y-8'>
        {Feed.map((user) => (
          <Card key={user.userId}>
            <CardHeader>
              <div className='flex items-center space-x-4'>
                <Avatar>
                  <AvatarImage
                    src={user?.userDetails.profile}
                    alt={user?.userDetails.firstName}
                  />
                  <AvatarFallback>{user?.userDetails.firstName}</AvatarFallback>
                </Avatar>
                <CardTitle>{user?.userDetails.firstName}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                {user?.latestPost?.map((video) => (
                  <div key={video._id} className='space-y-2'>
                    <video
                      src={video.videoUrl}
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0; // Reset the video to the start
                      }}
                      className='w-full aspect-video object-cover rounded-lg'
                    />
                    <p className='text-sm font-medium truncate'>
                      {video.title}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
