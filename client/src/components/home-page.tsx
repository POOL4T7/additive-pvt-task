'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
}

interface User {
  id: string;
  username: string;
  avatarUrl: string;
  videos: Video[];
}

export function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulating an API call to fetch users and their videos
    const fetchUsers = async () => {
      try {
        // In a real application, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        const mockUsers: User[] = [
          {
            id: '1',
            username: 'johndoe',
            avatarUrl: '/placeholder.svg?height=40&width=40',
            videos: [
              { id: '1', title: 'React Basics', thumbnailUrl: '/placeholder.svg?height=180&width=320' },
              { id: '2', title: 'Advanced CSS', thumbnailUrl: '/placeholder.svg?height=180&width=320' },
              { id: '3', title: 'Node.js Tutorial', thumbnailUrl: '/placeholder.svg?height=180&width=320' },
              { id: '4', title: 'GraphQL Intro', thumbnailUrl: '/placeholder.svg?height=180&width=320' },
              { id: '5', title: 'Docker for Beginners', thumbnailUrl: '/placeholder.svg?height=180&width=320' },
              { id: '6', title: 'Extra Video', thumbnailUrl: '/placeholder.svg?height=180&width=320' },
            ],
          },
          {
            id: '2',
            username: 'janesmith',
            avatarUrl: '/placeholder.svg?height=40&width=40',
            videos: [
              { id: '7', title: 'Python for Data Science', thumbnailUrl: '/placeholder.svg?height=180&width=320' },
              { id: '8', title: 'Machine Learning Basics', thumbnailUrl: '/placeholder.svg?height=180&width=320' },
              { id: '9', title: 'Web Scraping with Python', thumbnailUrl: '/placeholder.svg?height=180&width=320' },
            ],
          },
          {
            id: '3',
            username: 'alexjohnson',
            avatarUrl: '/placeholder.svg?height=40&width=40',
            videos: [
              { id: '10', title: 'UI/UX Design Principles', thumbnailUrl: '/placeholder.svg?height=180&width=320' },
              { id: '11', title: 'Figma Tutorial', thumbnailUrl: '/placeholder.svg?height=180&width=320' },
              { id: '12', title: 'Responsive Web Design', thumbnailUrl: '/placeholder.svg?height=180&width=320' },
              { id: '13', title: 'Color Theory for Designers', thumbnailUrl: '/placeholder.svg?height=180&width=320' },
            ],
          },
        ];
        setUsers(mockUsers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users and videos. Please try again later.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-8">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {[...Array(5)].map((_, videoIndex) => (
                    <Skeleton key={videoIndex} className="h-48 w-full" />
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
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Video Feed</h1>
      <div className="space-y-8">
        {users.map(user => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle>{user.username}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {user.videos.slice(0, 5).map(video => (
                  <div key={video.id} className="space-y-2">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <p className="text-sm font-medium truncate">{video.title}</p>
                  </div>
                ))}
              </div>
              {user.videos.length > 5 && (
                <p className="mt-4 text-sm text-gray-500">
                  And {user.videos.length - 5} more videos...
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}