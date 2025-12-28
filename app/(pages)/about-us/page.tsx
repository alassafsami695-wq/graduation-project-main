// import aboutusImage from "./img/about-us-1.png";

function Aboutus() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row-reverse items-center gap-8">
      {/* Left Section: Text Content */}
      <div className="flex-1 space-y-6">
        <h2 className="text-3xl font-bold text-[rgb(254,183,5)]">
          مرحباً بكم في مسار EDU
        </h2>

        <p className="text-lg leading-relaxed">
          منصتنا التعليمية تلعب دوراً مهماً في التعليم الإلكتروني، حيث نعتمد على
          أسلوب حديث قائم على تكنولوجيا المعلومات لتقديم المحتوى التعليمي
          للمتعلمين بأسرع وقت وأقل جهد. نسهم في تحسين التعلم ورفع نسب النجاح
          الأكاديمي للطلاب، ونسعى دائماً لنكون الأفضل.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-4">
          {/* Skilled Trainers */}
          <div className="flex items-center space-x-2 space-x-reverse hover:translate-x-3 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[rgb(254,183,5)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="text-base">مدربون محترفون</span>
          </div>

          {/* Online Lessons */}
          <div className="flex items-center space-x-2 space-x-reverse hover:translate-x-3 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[rgb(254,183,5)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-base">دروس عبر الإنترنت</span>
          </div>

          {/* Local Certificate */}
          <div className="flex items-center space-x-2 space-x-reverse hover:translate-x-3 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[rgb(254,183,5)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15l8-8V5h-2v2.172l-5.515 5.679a1 1 0 00-.485.876V15h-2v-2.828a1 1 0 00-1.414-1.414l5.515-5.679V5h2v7.172l-5.515 5.679a1 1 0 00-.485.876V15zm7-10v2.172l-7 7.172V15h-2v-2.828l7-7.172V5h2z"
              />
            </svg>
            <span className="text-base">شهادات محلية</span>
          </div>

          {/* Home Projects */}
          <div className="flex items-center space-x-2 space-x-reverse hover:translate-x-3 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[rgb(254,183,5)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6-10h6"
              />
            </svg>
            <span className="text-base">مشاريع منزلية</span>
          </div>
        </div>
      </div>

      {/* Right Section: Image */}
      <div className="flex-1">
        <img
          //   src={aboutusImage}
          alt="من نحن"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

export default Aboutus;
