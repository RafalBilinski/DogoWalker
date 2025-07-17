

function HomePage() {
  

  return (
    <div className="flex flex-col mx-0.5 md:mx-auto w-full min-h-[500px] items-center justify-center 
    bg-gradient-to-b from-transparent to-primary  text-white rounded-lg sm:rounded-none shadow-2xl overflow-hidden">
      
      <section className=" relative h-min-[500px] w-full flex-col items-center sm:px-3 overflow-hidden">
        {/* Background with parallax effect */}
        <div className="absolute inset-0 bg-[url('../images/homePage2/dogsPlaying.png')] bg-cover bg-center bg-blend-difference bg-white/10 rounded-t-2xl sm:rounded-none" 
        ></div>      
        
        {/* Content */}
        <div className="container mx-auto px-6 relative z-10 h-full ">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4  text-shadow-sm">
            Connect. <span className="text-accent">Walk.</span> Play.
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-white backdrop-blur-[1px] text-shadow-black text-shadow-[1px_1px_1px_black] max-w-2xl mb-8">
            Join the community that brings dog lovers together for walks, playdates, and adventures.
          </p>
          <div className="relative flex items-center justify-center w-full">
            <div className="absolute  w-50 h-20 bg-black/40 rounded-2xl text-lg px-8 py-3 text-white animate-pulse cursor-pointer"></div>
            <p className="relative z-10 text-lg sm:text-3xl cursor-pointer">Get Started!</p>
          </div>   

            <div className=" flex justify-center mt-6 my:auto w-full p-3 rounded-2xl">
              <svg className="lg:hidden animate-bounce w-10 h-10 text-white text-shadow-black text-shadow-lg " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
        </div>  
      </section>
      <section className="py-10 ">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">What Makes  <span className="text-accent">Us</span> Different</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all hover:-translate-y-2 hover:shadow-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Find Local Walks</h3>
              <p className="text-gray-600">Discover the best dog-friendly parks, trails, and walking routes in your neighborhood.</p>
            </div>
            
            {/* Feature 2 & 3 - similar structure */}
          </div>
        </div>
      </section>
      <section className="py-20 bg-transparent text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">See Our App in Action</h2>
          
          <div className="relative">
            {/* Phone mockup with screenshots */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <img src="/images/phone-mockup.png" alt="Phone mockup" className="w-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Carousel implementation here */}
                  <img src="/images/app-screenshot-1.png" alt="App screenshot" className="w-[90%] rounded-xl" />
                </div>
              </div>
            </div>
            
            {/* Carousel controls */}
            <div className="flex justify-center mt-8 gap-2">
              <button className="w-3 h-3 rounded-full bg-white/50"></button>
              <button className="w-3 h-3 rounded-full bg-white"></button>
              <button className="w-3 h-3 rounded-full bg-white/50"></button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 " >
        <div className="z-0 absolute  inset-0 h-full bg-radial  from-accent/50  to-transparent to-70% hover:transform hover:scale-150 transition duration-1000 opacity-70"></div>
        <div className="z-40 container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Dog's Adventure?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of dog owners who've transformed their daily walks into social experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="btn-white text-white text-lg px-8 py-3 flex items-center justify-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
              </svg>
              Get the App
            </button>
            <button className="btn-outline-white text-lg px-8 py-3">Learn More</button>
          </div>
          
          <div className="mt-12 flex justify-center space-x-6">
            <img src="/images/app-store.svg" alt="Download on App Store" className="h-12" />
            <img src="/images/google-play.svg" alt="Get it on Google Play" className="h-12" />
          </div>
        </div>
      </section>

    </div>
  );
}
export default HomePage;
