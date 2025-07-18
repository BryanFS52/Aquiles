"use client"

import Image from "next/image"

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md overflow-hidden">
      {/* Subtle, abstract background with floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Very subtle, slow-pulsating radial gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 to-gray-800/5 animate-radial-pulse-subtle"></div>

        {/* Small, slow-moving, abstract geometric fragments (squares/rectangles with rounded corners) */}
        <div className="absolute w-16 h-16 bg-slate-700/3 rounded-xl blur-sm animate-fragment-move-1 top-1/4 left-1/4 rotate-45"></div>
        <div className="absolute w-14 h-14 bg-gray-600/3 rounded-xl blur-sm animate-fragment-move-2 top-3/4 right-1/4 -rotate-30"></div>
        <div className="absolute w-20 h-20 bg-slate-800/3 rounded-xl blur-sm animate-fragment-move-3 bottom-1/4 left-1/2 rotate-60"></div>
        <div className="absolute w-12 h-12 bg-gray-700/3 rounded-xl blur-sm animate-fragment-move-4 top-1/2 left-1/6 -rotate-15"></div>
        <div className="absolute w-16 h-16 bg-slate-600/3 rounded-xl blur-sm animate-fragment-move-5 bottom-1/6 right-1/6 rotate-75"></div>
      </div>

      {/* Main elegant content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Central element with logo and elegant rings - NOW SLIGHTLY LARGER */}
        <div className="relative w-40 h-40 mb-8">
          {" "}
          {/* Increased from w-32 h-32 */}
          {/* Outer elegant ring */}
          <div className="absolute inset-0 border-2 border-transparent border-t-slate-700/80 border-r-slate-600/60 rounded-full animate-spin-elegant shadow-lg shadow-slate-700/30"></div>
          {/* Inner elegant ring */}
          <div className="absolute inset-5 border-2 border-transparent border-t-gray-600/90 border-l-gray-500/70 rounded-full animate-spin-reverse-elegant animation-delay-1500 shadow-md shadow-gray-600/25"></div>{" "}
          {/* Adjusted inset */}
          {/* Logo in the center - black and prominent */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden animate-pulse-gentle shadow-xl shadow-slate-700/40 backdrop-blur-sm border border-slate-600/50">
              {" "}
              {/* Increased from w-20 h-20 */}
              <Image
                src="/img/LogoAquilesWhite.png"
                alt="Spartan Helmet Logo"
                fill
                style={{ objectFit: "contain", filter: "invert(1)" }}
                priority // Load immediately for loader
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Soft inner glow for the logo (now subtle on black) */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/15 to-transparent rounded-full animate-ping-soft opacity-40"></div>
            </div>
          </div>
          {/* Subtle orbiting elements */}
          <div className="absolute inset-0 animate-orbit-slow">
            <div className="absolute -top-0.5 left-1/2 w-2 h-2 bg-slate-500/80 rounded-full shadow-md shadow-slate-500/40 transform -translate-x-1/2"></div>{" "}
            {/* Increased size */}
          </div>
          <div className="absolute inset-0 animate-orbit-reverse-slow animation-delay-2500">
            <div className="absolute top-1/2 -right-0.5 w-1.5 h-1.5 bg-gray-500/80 rounded-full shadow-md shadow-gray-500/40 transform -translate-y-1/2"></div>{" "}
            {/* Increased size */}
          </div>
        </div>

        {/* Minimal floating elements */}
        <div className="flex items-center space-x-3 mb-8">
          {" "}
          {/* Increased space-x and mb */}
          <div className="w-1.5 h-1.5 bg-slate-600/80 rounded-full animate-bounce-soft shadow-lg shadow-slate-600/40 animation-delay-0"></div>{" "}
          {/* Increased size */}
          <div className="w-2 h-2 bg-gray-500/85 rounded-full animate-bounce-soft shadow-lg shadow-gray-500/40 animation-delay-300"></div>{" "}
          {/* Increased size */}
          <div className="w-3 h-3 bg-gradient-to-r from-slate-600/80 to-gray-500/80 rounded-full animate-bounce-soft shadow-xl shadow-slate-600/50 animation-delay-600"></div>{" "}
          {/* Increased size */}
          <div className="w-2 h-2 bg-slate-700/85 rounded-full animate-bounce-soft shadow-lg shadow-slate-700/40 animation-delay-900"></div>{" "}
          {/* Increased size */}
          <div className="w-1.5 h-1.5 bg-gray-600/80 rounded-full animate-bounce-soft shadow-lg shadow-gray-600/40 animation-delay-1200"></div>{" "}
          {/* Increased size */}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-elegant {
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse-elegant {
          to { transform: rotate(-360deg); }
        }
        
        @keyframes orbit-slow {
          to { transform: rotate(360deg); }
        }
        
        @keyframes orbit-reverse-slow {
          to { transform: rotate(-360deg); }
        }
        
        @keyframes radial-pulse-subtle {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.08; }
        }

        @keyframes fragment-move-1 {
          0%, 100% { transform: translate(0, 0) rotate(45deg); opacity: 0.3; }
          25% { transform: translate(20px, -30px) rotate(60deg); opacity: 0.5; }
          50% { transform: translate(0, -60px) rotate(75deg); opacity: 0.3; }
          75% { transform: translate(-20px, -30px) rotate(60deg); opacity: 0.5; }
        }
        @keyframes fragment-move-2 {
          0%, 100% { transform: translate(0, 0) rotate(-30deg); opacity: 0.3; }
          25% { transform: translate(-20px, 30px) rotate(-45deg); opacity: 0.5; }
          50% { transform: translate(0, 60px) rotate(-60deg); opacity: 0.3; }
          75% { transform: translate(20px, 30px) rotate(-45deg); opacity: 0.5; }
        }
        @keyframes fragment-move-3 {
          0%, 100% { transform: translate(0, 0) rotate(60deg); opacity: 0.3; }
          25% { transform: translate(30px, 20px) rotate(75deg); opacity: 0.5; }
          50% { transform: translate(60px, 0) rotate(90deg); opacity: 0.3; }
          75% { transform: translate(30px, -20px) rotate(75deg); opacity: 0.5; }
        }
        @keyframes fragment-move-4 {
          0%, 100% { transform: translate(0, 0) rotate(-15deg); opacity: 0.3; }
          25% { transform: translate(-30px, -20px) rotate(-30deg); opacity: 0.5; }
          50% { transform: translate(-60px, 0) rotate(-45deg); opacity: 0.3; }
          75% { transform: translate(-30px, 20px) rotate(-30deg); opacity: 0.5; }
        }
        @keyframes fragment-move-5 {
          0%, 100% { transform: translate(0, 0) rotate(75deg); opacity: 0.3; }
          25% { transform: translate(20px, -30px) rotate(90deg); opacity: 0.5; }
          50% { transform: translate(0, -60px) rotate(105deg); opacity: 0.3; }
          75% { transform: translate(-20px, -30px) rotate(90deg); opacity: 0.5; }
        }
        
        @keyframes bounce-soft {
          0%, 100% { 
            transform: translateY(0px) scale(1);
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-10px) scale(1.05);
            opacity: 1;
          }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { 
            opacity: 0.9;
            transform: scale(1);
            box-shadow: 0 15px 30px -8px rgba(71, 85, 105, 0.4);
          }
          50% { 
            opacity: 1;
            transform: scale(1.03);
            box-shadow: 0 15px 30px -8px rgba(71, 85, 105, 0.6);
          }
        }
        
        @keyframes ping-soft {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-spin-elegant {
          animation: spin-elegant 6s linear infinite;
        }
        
        .animate-spin-reverse-elegant {
          animation: spin-reverse-elegant 5s linear infinite;
        }
        
        .animate-orbit-slow {
          animation: orbit-slow 8s linear infinite;
        }
        
        .animate-orbit-reverse-slow {
          animation: orbit-reverse-slow 7s linear infinite;
        }
        
        .animate-radial-pulse-subtle {
          animation: radial-pulse-subtle 10s ease-in-out infinite alternate;
        }

        .animate-fragment-move-1 { animation: fragment-move-1 15s ease-in-out infinite; }
        .animate-fragment-move-2 { animation: fragment-move-2 17s ease-in-out infinite 2s; }
        .animate-fragment-move-3 { animation: fragment-move-3 16s ease-in-out infinite 4s; }
        .animate-fragment-move-4 { animation: fragment-move-4 18s ease-in-out infinite 1s; }
        .animate-fragment-move-5 { animation: fragment-move-5 19s ease-in-out infinite 3s; }
        
        .animate-bounce-soft {
          animation: bounce-soft 2.5s ease-in-out infinite;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 4s ease-in-out infinite;
        }
        
        .animate-ping-soft {
          animation: ping-soft 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animation-delay-0 { animation-delay: 0s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-900 { animation-delay: 0.9s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-2500 { animation-delay: 2.5s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        .inset-5 {
          top: 1.25rem;
          right: 1.25rem;
          bottom: 1.25rem;
          left: 1.25rem;
        }
      `}</style>
    </div>
  )
}

export default Loader
