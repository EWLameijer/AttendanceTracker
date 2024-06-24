import { useNavigate } from "react-router-dom";

const HomeButton = () => {
  const navigate = useNavigate();

  return <button onClick={() => navigate("/coach-view")}>Home</button>;
};

export default HomeButton;
