import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./app,router";
import { AuthProvider } from "./features/auth/auth.context";
import { HomeProvider } from "./features/home/Home.context";
const App = () => {
  return (
    <>
      <AuthProvider>
        <HomeProvider>
          <RouterProvider router={router} />
        </HomeProvider>
      </AuthProvider>
    </>
  );
};

export default App;
