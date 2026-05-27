import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Posts from './pages/Posts'
import PostEdit from './pages/PostEdit'
import Pages from './pages/Pages'
import Media from './pages/Media'
import Settings from './pages/Settings'
import Users from './pages/Users'
import Contacts from './pages/Contacts'

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/new" element={<PostEdit />} />
          <Route path="posts/:id" element={<PostEdit />} />
          <Route path="pages" element={<Pages />} />
          <Route path="media" element={<Media />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
