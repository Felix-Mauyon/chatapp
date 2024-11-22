import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Auth } from './components/Auth'
import Chat from './components/Chat'
import Group from './components/Group'
import { JoinGroup } from './components/JoinGroup'



function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Auth />}></Route>
          <Route path='/create-group' element={<Group />}></Route>
          <Route path='/chat' element={<Chat />}></Route>
          <Route path='/chat/:groupId' element={<Chat />}></Route>
          <Route path='/group/:groupId' element={<JoinGroup />}></Route>
          <Route path='/failure' element={<Navigate to='/' />}></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
