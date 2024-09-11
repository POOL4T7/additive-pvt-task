import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from '@/components/Navbar';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Profile from '@/pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  console.log(import.meta.env.VITE_API_URL);
  return (
    <div className='main'>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
