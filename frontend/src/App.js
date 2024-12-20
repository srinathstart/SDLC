import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './PrivateRoute';
import EditUser from './pages/EditUser';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import ProductUpload from './pages/ProductUpload';
import ProductDetails from './pages/ProductDetails';
import MyProducts from './pages/MyProducts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path='/' element={< Home />} />
          <Route path='/edit' element={< EditUser />} />
          <Route path='/userprofile' element={< Profile />} />
          <Route path='/chat' element={< Chat />} />
          <Route path='/uploadpost' element={< ProductUpload />} />
          <Route path='/product/:id' element={< ProductDetails />} />
          <Route path='/myposts' element={< MyProducts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
