import useAuth from "../UseAuth";
import { useNavigate } from "react-router";

const Protected = ({ children }) => {
  const Navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if ((!user, !loading)) {
    return <Navigate to="/login"/>;
  }

  return children;
};
export default Protected;
