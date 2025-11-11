import { useNavigate } from "react-router";

import LoadingAnimation from "./loadinganimation";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Index() {
  const navigate = useNavigate();

  const handleAnimationComplete = () => {
    navigate("/landingpage");
  };

  return <LoadingAnimation onAnimationComplete={handleAnimationComplete} />;
}