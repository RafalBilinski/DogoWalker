import { useEffect } from "react";
import { useAuth } from "../services/AuthFeatures/AuthContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const imgFadeInDuration: number = 500;

  useEffect(() => {
    if (!currentUser) navigate("/login"); // Redirect to login page;
  }, [currentUser]);

  return (
    <div
      className="flex flex-col mx-0.5 md:mx-auto w-full md:w-fit py-5 items-center justify-center min-h-[calc(100vh-7rem)] 
    bg-gradient-to-br from-secondary to-primary  text-white rounded-lg shadow-2xl  "
    >
      <h1 className="text-2xl md:text-5xl my-4 text-shadow-xs text-shadow-black">
        Welcome back
        <span className="text-gray-700 font-bold text-shadow-xs text-shadow-amber-50">
          {" " + currentUser?.firebaseUser.displayName + "!"}
        </span>
      </h1>
      <div className="grid grid-cols-1 items-center w-full h-full p-4 gap-4 sm:grid-cols-3">
        {/* Explore section */}
        <section
          className="group md:row-span-2 homePage-section relative"
          onClick={() => navigate("/explore")}
        >
          <img
            src="/images/homePage2/small/forestSmall.png"
            className="absolute inset-0 w-full h-full object-cover z-0 homePage-section"
            alt=""
            aria-hidden="true"
          />
          <img
            src="/images/homePage2/forest.png"
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover z-0 homePage-section transition duration-${imgFadeInDuration} ease-in opacity-0`}
            alt="Forest background"
            onLoad={e => e.currentTarget.classList.replace("opacity-0", "opacity-100")}
          />
          <h2 className="homePage-section-title relative z-10 ">Explore</h2>
        </section>

        {/* Find new friends section */}
        <section className="md:col-span-2 homePage-section relative">
          <img
            src="/images/homePage2/small/goldensHugSmall.png"
            className="absolute inset-0 w-full h-full object-cover z-0 homePage-section"
            alt=""
            aria-hidden="true"
          />
          <img
            src="/images/homePage2/goldensHug.png"
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover z-0 homePage-section transition duration-${imgFadeInDuration} ease-in opacity-0`}
            alt="Golden retrievers hugging"
            onLoad={e => e.currentTarget.classList.replace("opacity-0", "opacity-100")}
          />
          <h2 className="homePage-section-title relative z-10">Find new friends</h2>
        </section>

        {/* Create community section */}
        <section className="sm:col-span-2 sm:order-1 md:order-0 md:col-span-1 homePage-section relative">
          <img
            src="/images/homePage2/small/peopleWalkingDogsSmall.png"
            className="absolute inset-0 w-full h-full object-cover z-0 homePage-section"
            alt=""
            aria-hidden="true"
          />
          <img
            src="/images/homePage2/peopleWalkingDogs.png"
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover z-0 homePage-section transition duration-${imgFadeInDuration} ease-in opacity-0`}
            alt="People walking dogs"
            onLoad={e => e.currentTarget.classList.replace("opacity-0", "opacity-100")}
          />
          <h2 className="homePage-section-title relative z-10">Create community</h2>
        </section>

        {/* Take care section */}
        <section className="md:row-span-2 homePage-section relative">
          <img
            src="/images/homePage2/small/takeCareSmall.png"
            className="absolute inset-0 w-full h-full object-cover z-0 homePage-section"
            alt=""
            aria-hidden="true"
          />
          <img
            src="/images/homePage2/takeCare.png"
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover z-0 homePage-section transition duration-${imgFadeInDuration} ease-in opacity-0`}
            alt="Taking care of dog"
            onLoad={e => e.currentTarget.classList.replace("opacity-0", "opacity-100")}
          />
          <h2 className="homePage-section-title relative z-10">
            Take care <span className="hidden sm:block">of your dog</span>
          </h2>
        </section>

        {/* Let your dog play section */}
        <section className="group md:col-span-2 homePage-section relative">
          <img
            src="/images/homePage2/small/dogsPlayingSmall.png"
            className="absolute inset-0 w-full h-full object-cover z-0 homePage-section"
            alt=""
            aria-hidden="true"
          />
          <img
            src="/images/homePage2/dogsPlaying.png"
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover z-0 homePage-section transition duration-${imgFadeInDuration} ease-in opacity-0`}
            alt="Dogs playing"
            onLoad={e => e.currentTarget.classList.replace("opacity-0", "opacity-100")}
          />
          <h2 className="homePage-section-title group-hover:animate-bounce z-10">
            Let your dog play!
          </h2>
        </section>
      </div>
    </div>
  );
}
export default HomePage;
