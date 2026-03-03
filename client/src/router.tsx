import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/events/:slug",
    element: <EventDetail />,
  },
]);