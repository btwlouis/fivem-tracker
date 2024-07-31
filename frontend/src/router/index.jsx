import { createHashRouter } from "react-router-dom";
import App from "../components/App";
import Server from "../components/Server";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/server/:id",
    element: <Server />,
  },
]);

export default router;
