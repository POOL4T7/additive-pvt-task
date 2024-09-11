import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  return (
    <nav className='bg-white shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <Link to='/' className='flex-shrink-0 flex items-center'>
              <span className='text-xl font-bold'>MyApp</span>
            </Link>
          </div>
          <div className='flex items-center'>
            {isAuthenticated ? (
              <Link to='/profile'>
                <Button variant='ghost'>Profile</Button>
              </Link>
            ) : (
              <>
                <Link to='/login'>
                  <Button variant='ghost' className='mr-2'>
                    Login
                  </Button>
                </Link>
                <Link to='/signup'>
                  <Button variant='ghost' className='mr-2'>
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
