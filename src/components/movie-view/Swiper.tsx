import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Autoplay } from "swiper/modules";
import { RiPlayFill } from "react-icons/ri";
import { GoSun } from "react-icons/go";
import { PiMoonLight } from "react-icons/pi";
import { IMAGE_URL } from "@/const";
import type { IMovie } from "@/types/types";
import type { Swiper as SwiperType } from "swiper";

interface SwiperSliderProps {
  moviesData: IMovie[];
  thumbsSwiper: SwiperType | null;
  setThumbsSwiper: (swiper: SwiperType) => void;
  theme: boolean;
  handleTheme: () => void;
  isMobile: boolean;
  getGenreNames: (ids: number[]) => string[];
}

const SwiperSlider: React.FC<SwiperSliderProps> = ({
  moviesData,
  thumbsSwiper,
  setThumbsSwiper,
  theme,
  handleTheme,
  isMobile,
  getGenreNames
}) => {
  return (
    <>
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: true,
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2 md:rounded-xl overflow-hidden"
      >
        {moviesData.map((movie) => (
          <SwiperSlide key={movie.id} className="relative">
            <img
              className="w-full h-full object-contain"
              src={IMAGE_URL + movie.backdrop_path}
              loading="lazy"
              alt={movie.title}
            />
            <button
              onClick={handleTheme}
              className="md:hidden absolute z-20 top-4 right-4 flex items-center justify-center gap-2 backdrop-blur-md bg-bg-dark-900/20 light:bg-bg-light-900/40 duration-150 ease-out size-9 rounded-xl"
            >
              {theme ? (
                <PiMoonLight className="text-xl" />
              ) : (
                <GoSun className="text-xl" />
              )}
            </button>
            <div className="absolute right-1/2 bottom-7 sm:bottom-6 translate-x-1/2 flex flex-col gap-4 w-full">
              <h1 className="text-2xl md:text-3xl lg:text-[32px] w-[90%] sm:w-[80%] mx-auto md:w-full text-text-dark-100 tracking-wide text-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
                {movie.title}
              </h1>
              <div className="flex items-center justify-center gap-2 text-sm tracking-wide text-text-dark-100">
                <p className="text-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
                  {movie.release_date.slice(0, 4)}
                </p>
                <span className="text-xs leading-4">•</span>
                <p className="line-clamp-1 flex items-center gap-1 flex-wrap">
                  {getGenreNames(movie.genre_ids.slice(0, 1)).map((genre, index) => (
                    <span key={index} className="text-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
                      {genre}
                    </span>
                  ))}
                </p>
                <span className="text-xs leading-4">•</span>
                <p className="uppercase text-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
                  {movie.original_language}
                </p>
                <span className="text-xs leading-4">•</span>
                <p className="text-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
                  {movie.adult ? "18+" : "6+"}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <button className="w-[82%] min-[450px]:w-[380px] md:w-[380px] h-12 sm:h-[52px] flex items-center justify-center gap-[7px] bg-text-dark-100 rounded-xl text-primary">
                  <RiPlayFill className="text-2xl" />
                  <span className="tracking-wide">Watch</span>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {!isMobile && (
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={4}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper select-none"
        >
          {moviesData.map((movie) => (
            <SwiperSlide key={movie.id} className="overflow-hidden rounded-xl cursor-pointer">
              <img
                className="w-full h-full object-contain hover:scale-105 duration-150 ease-out"
                src={IMAGE_URL + movie.backdrop_path}
                loading="lazy"
                alt={movie.title}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default SwiperSlider;
