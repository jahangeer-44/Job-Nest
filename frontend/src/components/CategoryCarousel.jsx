import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Data Science",
  "Graphic Designer",
  "FullStack Developer"
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="py-16 ">
      <h2 className="text-3xl font-bold text-center text-[#043873] mb-10">
        Explore Job Categories
      </h2>
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {categories.map((cat) => (
            <CarouselItem key={cat} className="basis-1/2 md:basis-1/3 lg:basis-1/4 flex justify-center">
              <Button
                onClick={() => searchJobHandler(cat)}
                variant="outline"
                className="rounded-full px-6 py-3 border-2 border-[#4F9CF9] text-[#043873] hover:bg-[#6A38C2] hover:border-[#6A38C2] hover:text-white font-semibold transition-colors cursor-pointer"
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-[#043873] hover:text-[#4F9CF9]" />
        <CarouselNext className="text-[#043873] hover:text-[#4F9CF9]" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;