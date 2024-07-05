import './App.css';
import Assistant from './component/Assistant';
import CreateAssistant from './component/CreateAssistant';
import Chat from './component/Chat';
import AddAction from './component/AddAction';
import AddKnowledge from './component/AddKnowledge';
import Landing from './component/Landing';
import Transcriber from './component/Transcriber';
import Synthesizer from './component/Synthesizer';

import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { useEffect } from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/create',
    element: <CreateAssistant />
  },
  {
    path: '/knowledgebase/:uuid',
    element: <AddKnowledge />
  },
  {
    path: '/action/:uuid',
    element: <AddAction />
  },
  {
    path:'/chat/:uuid',
    element:<Chat />
  },
  {
    path:'/transcriber/:uuid',
    element:<Transcriber />
  },
  {
    path:'/synthesizer/:uuid',
    element:<Synthesizer />
  }
]);

function App() {

  return (
    <div style={{background:'#ded5e6', height:'100vh'}}>
      <RouterProvider router={router}/>
    </div>
  );
}
export default App;