import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/componants/Protected";
import Home from '../src/features/home/pages/Home'
import MoodifyAdmin from '../src/features/admenpanel/Admin'

const routerConfig = [
  {
    path: "/",
    element: (
      <Protected>
        <Home/>
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },{
    path : "/dashbord" , 
    element : (
      <Protected adminOnly>
        <MoodifyAdmin/>
      </Protected>
    )
  }
];

export const router = createBrowserRouter(routerConfig);
