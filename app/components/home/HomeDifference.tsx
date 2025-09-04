import { Recycle, Handbag } from "lucide-react";

const HomeDifference = () => {

    return(
        <div className="py-16 text-center bg-[primary-green] "> 

            <div> <h2 className="text-3xl font-bold text-white">Ready to Make a Difference? </h2></div>
            <div> <p className="text-lg text-white">Join thousands of users who are already earning while helping the environment. Start your recycling journey today. </p></div>

            {/* Buttons */}
            <div className="flex flex-col my-12  sm:items-center sm:justify-center sm:flex-row gap-4 sm:gap-6 animate-fade-in-up animation-delay-600">
              <button className="
                gradient-button font-space-grotesk font-medium text-lg leading-6
                px-8 py-4 rounded-full text-black hover:shadow-xl
                transform hover:scale-105 transition-all duration-300
                flex items-center justify-center gap-3 min-w-[200px]
              ">
                <Recycle className="w-5 h-5" />
                Start Recycle Now
              </button>
              
              <button className="
                bg-black font-space-grotesk font-medium text-lg leading-6
                px-8 py-4 rounded-full text-white border border-gray-700
                hover:bg-gray-900 transform hover:scale-105 transition-all duration-300
                flex items-center justify-center gap-3 min-w-[180px]
              ">
                <Handbag className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
        </div>
    )
}

export default HomeDifference;
