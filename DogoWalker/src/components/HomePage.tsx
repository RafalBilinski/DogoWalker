import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useState } from "react";

function HomePage() {
  

  return (
    <div className="flex flex-col mx-0.5 md:mx-auto w-full md:w-fit py-5 items-center justify-center h-[calc(100vh-6rem)] min-h-[500px] bg-gradient-to-br from-primary to-secondary  text-white rounded-lg shadow-2xl outline-1 outline-white">
      <h1 className=" text-2xl md:text-5xl my-4 text-shadow-xs text-shadow-black">
        Welcome to <span className="text-gray-700 font-bold text-shadow-xs text-shadow-amber-50">Doggo Walker</span>{" "}
      </h1>
         <div className="grid grid-cols-1 items-center w-full h-full p-4 gap-4 sm:grid-cols-3">
        {/* Explore section */}
        <section className="md:row-span-2 homePage-section relative">
          <img 
            src="/images/homePage2/forest.png" 
            loading="lazy" 
            className="absolute inset-0 w-full h-full object-cover z-0 homePage-section" 
            alt="Forest background" 
          />
          <h2 className="homePage-section-title relative z-10 ">Explore</h2>
        </section>
        
        {/* Find new friends section */}
        <section className="md:col-span-2 homePage-section relative">
          <img 
            src="/images/homePage2/goldensHug.png" 
            loading="lazy" 
            className="absolute inset-0 w-full h-full object-cover z-0 homePage-section" 
            alt="Golden retrievers hugging" 
          />
          <h2 className="homePage-section-title relative z-10">Find new friends</h2>
        </section>
        
        {/* Create community section */}
        <section className="sm:col-span-2 sm:order-1 md:order-0 md:col-span-1 homePage-section relative">
          <img 
            src="/images/homePage2/peopleWalkingDogs.png" 
            loading="lazy" 
            className="absolute inset-0 w-full h-full object-cover z-0 homePage-section" 
            alt="People walking dogs" 
          />
          <h2 className="homePage-section-title relative z-10">Create community</h2>
        </section>
        
        {/* Take care section */}
        <section className="md:row-span-2 homePage-section relative">
          <img 
            src="/images/homePage2/takeCare.png" 
            loading="lazy" 
            className="absolute inset-0 w-full h-full object-cover z-0 homePage-section" 
            alt="Taking care of dog" 
          />
          <h2 className="homePage-section-title relative z-10">
            Take care <span className="hidden sm:block">of your dog</span>
          </h2>
        </section>
        
        {/* Let your dog play section */}
        <section className="md:col-span-2 homePage-section relative">
          <img 
            src="/images/homePage2/dogsPlaying.png" 
            loading="lazy" 
            className="absolute inset-0 w-full h-full object-cover z-0 homePage-section" 
            alt="Dogs playing" 
          />
          <h2 className="homePage-section-title hover:animate-bounce relative z-10">Let your dog play!</h2>
        </section>
      </div>
    </div>
  );
}
export default HomePage;
