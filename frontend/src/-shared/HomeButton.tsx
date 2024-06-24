import { useNavigate } from "react-router-dom";

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/attendance-management")}>Home</button>
  );
};

export default HomeButton;
