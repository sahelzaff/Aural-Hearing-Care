'use client';
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { faker } from "@faker-js/faker";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import assets from "../../../public/assets/assets";

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch random user data
        const userResponse = await axios.get(
          "https://randomuser.me/api/?results=6"
        );
        const users = userResponse.data.results;

        // Generate random reviews
        const reviews = users.map((user) => ({
          id: user.login.uuid,
          profileImage: user.picture.large,
          name: `${user.name.first} ${user.name.last}`,
          stars: faker.datatype.number({ min: 4, max: 5 }),
          review: faker.lorem.paragraph(),
        }));

        setTestimonials(reviews);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    centerMode: true,
  };

  return (
    <div className="w-full px-16 py-20 h-auto">
      <div>
        <div className="flex items-center gap-2 ">
          <h1 className="text-tmc-red font-outfit font-medium text-[19px]">
            Testimonials
          </h1>
          <div className="h-[2px] w-6 bg-tmc-red"></div>
        </div>
        <h2 className="text-auralyellow font-outfit font-bold text-6xl pb-1">
        Happy Patients
        </h2>
        <p className="text-gray-600 font-poppins text-lg">
        Read what our patients have to say about us. Read all reviews here.
        </p>
      </div>
      <div className="relative py-20 h-auto">
        <Slider {...settings}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="relative px-5">
              <img
                src={assets.quote_blue}
                alt="Quote"
                className="absolute top-[-5%] left-[-2%] w-18 h-16"
                style={{ zIndex: 2 }}
              />
              <div className="py-10 px-14 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col justify-between" style={{ height: '250px' }}>
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.profileImage}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-300"
                  />
                  <div className="ml-4">
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <div className="flex items-center">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-yellow-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                        >
                          <path d="M12 2l2.3 6.9 7.4.6-5.5 4.2 2 6.9-5.2-3.8-5.3 3.8L9.8 14 4.3 9.7l7.4-.6z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.review}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonial;
