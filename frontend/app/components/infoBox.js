"use client";

const InfoBox = ({ title, textInfo, icon: Icon }) => {
  return (
    <div className="flex h-auto md:h-24 w-full md:w-52 rounded-xl shadow-xl border-2 bg-white dark:bg-#B0B0B0 border-lightGreen dark:border-darkBlue p-2">
      <div className="flex items-center justify-center md:justify-start w-full">
        <div className="bg-lightGreen dark:bg-darkBlue rounded-2xl p-3">
          {Icon && <Icon className="w-12 h-12 text-white mx-3 flex-shrink-0" />}
        </div>
        <div className="flex flex-col justify-center ml-6">
          <h1 className="text-xl text-black">{title}</h1>
          <p className="text-xl text-black font-semibold">{textInfo}</p>
        </div>
      </div>
    </div>
  );

  /* Compañeros 
            <div className="flex h-auto md:h-24 w-full md:w-52 rounded-lg shadow-lg border-2 bg-white border-green-500 p-2">
              <div className="flex items-center justify-center md:justify-start w-full">
                <div className="bg-[#0e324d] rounded-2xl p-3">
                  <FaUsers className="text-4xl text-white stroke-current stroke-[1px]" />
                </div>
                <div className="flex flex-col justify-center ml-6">
                  <h1 className="text-custom-blue font-semibold text-2xl font-inter">{compañeros.length}</h1>
                  <p className="text-black font-inter font-medium text-lg">Compañeros</p>
                </div>
              </div>
            </div>*/
};

export default InfoBox;
