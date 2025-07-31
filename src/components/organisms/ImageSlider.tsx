'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Media {
  id: number;
  name: string;
  url: string;
  alternativeText?: string | null;
}

interface SliderItem {
  id: number;
  Text_field: string;
  Media_field: Media[];
}

const ImageSlider = () => {
  const [sliderData, setSliderData] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_CMS_API_URL}/api/image-sliders?populate=*`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CMS_API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then(({ data }) => setSliderData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 border-l-4 border-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto my-8">
      <Swiper
        spaceBetween={30}
        centeredSlides
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {sliderData.flatMap((item) =>
          item.Media_field.map((media, idx) => (
            <SwiperSlide key={`${item.id}-${media.id}`}>
              <div className="relative h-96 w-full">
                <img
                  src={`${process.env.NEXT_PUBLIC_CMS_API_URL}${media.url}`}
                  alt={media.alternativeText || `Slide ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
                  <h3 className="text-2xl font-bold text-white">{item.Text_field}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
