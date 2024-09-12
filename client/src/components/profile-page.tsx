'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Pencil } from 'lucide-react'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
  bio: z.string().max(500, 'Bio must not exceed 500 characters'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface UserData {
  userId: { $oid: string };
  latestPost: {
    userId: { $oid: string };
    createdAt: { $date: string };
    updatedAt: { $date: string };
    __v: number;
    _id: { $oid: string };
    title: string;
    description: string;
    videoUrl: string;
  };
  userDetails: {
    password: string;
    __v: number;
    _id: { $oid: string };
    firstName: string;
    status: string;
    createdAt: { $date: string };
    updatedAt: { $date: string };
    bio: string;
    lastName: string;
    mobile: string;
    email: string;
  };
}

export function ProfilePageComponent() {
  const [userData, setUserData] = useState<UserData>({
    userId: { $oid: "66e1d3d8a1532fec35750eaf" },
    latestPost: {
      userId: { $oid: "66e1d3d8a1532fec35750eaf" },
      createdAt: { $date: "2024-09-12T10:57:29.189Z" },
      updatedAt: { $date: "2024-09-12T10:57:29.189Z" },
      __v: 0,
      _id: { $oid: "66e2c9193e70fcd2f07b4dda" },
      title: "Test1 ",
      description: "hey there",
      videoUrl: "",
    },
    userDetails: {
      password: "$2a$10$0DJFtOgoADNTjRat1WP0ieKz2S/3liiMI1Q3KlAIzcTZmpyFUt/wG",
      __v: 0,
      _id: { $oid: "66e1d3d8a1532fec35750eaf" },
      firstName: "Gulshan",
      status: "active",
      createdAt: { $date: "2024-09-11T17:31:04.112Z" },
      updatedAt: { $date: "2024-09-11T19:16:39.116Z" },
      bio: "I am a video content creator passionate about technology and education. hello",
      lastName: "Gupta",
      mobile: "9956816875",
      email: "abhinavg90834@gmail.com",
    },
  })

  const [profileCompletion, setProfileCompletion] = useState(0)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: userData.userDetails.firstName,
      lastName: userData.userDetails.lastName,
      email: userData.userDetails.email,
      mobile: userData.userDetails.mobile,
      bio: userData.userDetails.bio,
    }
  })

  const watchAllFields = watch()

  useEffect(() => {
    const calculateCompletion = () => {
      const fields = ['firstName', 'lastName', 'email', 'mobile', 'bio']
      const filledFields = fields.filter(field => watchAllFields[field as keyof ProfileFormValues]?.trim() !== '')
      return (filledFields.length / fields.length) * 100
    }

    setProfileCompletion(calculateCompletion())
  }, [watchAllFields])

  const handleBioUpdate = (newBio: string) => {
    setUserData(prevData => ({
      ...prevData,
      userDetails: {
        ...prevData.userDetails,
        bio: newBio
      }
    }))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt={`${userData.userDetails.firstName} ${userData.userDetails.lastName}`} />
              <AvatarFallback>{userData.userDetails.firstName[0]}{userData.userDetails.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{userData.userDetails.firstName} {userData.userDetails.lastName}</CardTitle>
              <CardDescription>{userData.userDetails.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register('firstName')} />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register('lastName')} />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input id="mobile" {...register('mobile')} />
                {errors.mobile && <p className="text-sm text-red-500">{errors.mobile.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" {...register('bio')} />
                {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
              </div>
            </form>
            <div className="space-y-2">
              <Label>Profile Completion</Label>
              <Progress value={profileCompletion} className="w-full" />
              <p className="text-sm text-gray-500">{profileCompletion.toFixed(0)}% complete</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Update Profile</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-semibold">Title</Label>
              <p className="text-sm text-gray-600">{userData.latestPost.title}</p>
            </div>
            <div>
              <Label className="font-semibold">Description</Label>
              <p className="text-sm text-gray-600">{userData.latestPost.description}</p>
            </div>
            <div>
              <Label className="font-semibold">Posted On</Label>
              <p className="text-sm text-gray-600">{new Date(userData.latestPost.createdAt.$date).toLocaleString()}</p>
            </div>
            {userData.latestPost.videoUrl && (
              <div>
                <Label className="font-semibold">Video</Label>
                <div className="mt-2">
                  <video controls className="w-full max-w-md mx-auto">
                    <source src={userData.latestPost.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}