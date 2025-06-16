"use client";

const InfoBox = ({ title, textInfo, icon: Icon }) => {
  return (
    <div className="flex h-24 w-full md:max-w-60 rounded-xl shadow-xl border-2 bg-white dark:bg-gray-300 bg-gradient-to-r from-lime-400 to-lime-200 border-lime-600 dark:border-darkBlue p-2">
      <div className="flex items-center w-full">
        <div className="bg-lightGreen dark:bg-darkBlue rounded-2xl p-2 flex-shrink-0">
          {Icon && <Icon className="w-10 h-10 text-white" />}
        </div>
        <div className="flex flex-col justify-center ml-4 w-full overflow-hidden">
          <h1 className="text-base md:text-lg text-black font-semibold truncate">
            {title}
          </h1>
          <p className="text-sm md:text-base text-black break-words whitespace-normal line-clamp-2">
            {textInfo}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;