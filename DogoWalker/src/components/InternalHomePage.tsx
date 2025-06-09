import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate("/"); // Redirect to home or dashboard;
  }, [currentUser]);

  return (
    <div className="flex flex-col mx-0.5 md:mx-auto w-full md:w-fit py-5 items-center justify-center h-[calc(100vh-6rem)] bg-gradient-to-br from-primary to-secondary  text-white rounded-lg shadow-2xl outline-1 outline-white">
      <h1 className="text-2xl md:text-5xl my-4 text-shadow-xs text-shadow-black">
        Welcome back
        <span className="text-gray-700 font-bold text-shadow-xs text-shadow-amber-50">
          {" " + currentUser?.firebaseUser.displayName + "!"}
        </span>
      </h1>
      <div className="grid grid-cols-1 items-center w-full h-full p-4 gap-4 sm:grid-cols-3 ">
        <div className=" md:row-span-2 homePage-section bg-[url('/images/homePage2/forest.png')] " onClick={() => navigate("/explore")}>
          <h2 className="homePage-section-title "> Explore </h2>
        </div>
        <div className=" md:col-span-2 homePage-section bg-[url('/images/homePage2/goldensHug.png')]">
          <h2 className="homePage-section-title"> Find new friends </h2>
        </div>
        <div className=" sm:col-span-2 sm:order-1 md:order-0 md:col-span-1 homePage-section bg-[url('/images/homePage2/peopleWalkingDogs.png')] ">
          <h2 className="homePage-section-title"> Create community</h2>
        </div>
        <div className="md:row-span-2 homePage-section bg-[url('/images/homePage2/takeCare.png')]">
          <h2 className="homePage-section-title">
            Take care <span className="hidden sm:block">of your dog</span>
          </h2>
        </div>
        <div className=" md:col-span-2 homePage-section bg-[url('/images/homePage2/dogsPlaying.png')] ">
          <h2 className="homePage-section-title hover:animate-bounce"> Let your dog play! </h2>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
