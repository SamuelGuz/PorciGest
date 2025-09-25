'use client';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ImageCarousel = () => {
  return (
    <div className="max-w-2xl mx-auto mt-20 rounded-lg overflow-hidden shadow-none border-none">
      <Carousel
        showThumbs={false}
        showArrows={true}
        infiniteLoop
        autoPlay
        interval={3000}
        showStatus={false}
        showIndicators={false}
        className="rounded-lg"
      >
        <div>
          <img src="/cerditos.jpg" alt="Imagen 1" className="w-full aspect-[16/9] object-cover object-center" />
        </div>
        <div>
          <img src="/cerdo3.jpg" alt="Imagen 2" className="w-full aspect-[16/9] object-cover object-center" />
        </div>
        <div>
          <img src="/cerdo4.jpg" alt="Imagen 3" className="w-full aspect-[16/9] object-cover object-center" />
        </div>
        <div>
          <img src="/cerdo5.jpg" alt="Imagen 4" className="w-full aspect-[16/9] object-cover object-center" />
        </div>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
