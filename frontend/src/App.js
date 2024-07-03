import './App.css';
import Assistant from './component/Assistant';
import CreateAssistant from './component/CreateAssistant';
// import Chat from './component/Chat';
import AddAction from './component/AddAction';
import AddKnowledge from './component/AddKnowledge';
import Landing from './component/Landing';

import Streaming from './component/Streaming.tsx';
import Stream from './component/Stream.js';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { useEffect } from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Stream />
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
  // {
  //   path:'/chat/:uuid',
  //   element:<Chat />
  // }
]);

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
export default App;