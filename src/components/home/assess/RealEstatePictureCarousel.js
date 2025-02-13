import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './RealEstatePictureCarousel.css'; // 你可以自定义样式
import { useLocation } from 'react-router-dom';

const RealEstatePictureCarousel = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const region = queryParams.get('region'); // 获取 region 参数
  const folder = queryParams.get('folder'); // 获取 folder 参数

  const [images, setImages] = useState([]);

  useEffect(() => {
    // 从API获取图片
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://111.231.79.183:5201/api/getrealestatepicturecarouselimages?region=${encodeURIComponent(region)}&folder=${encodeURIComponent(folder)}`
        );
        const data = await response.json(); // 获取图片URL列表
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (region && folder) {
      fetchImages();
    }
  }, [region, folder]); // 依赖 region 和 folder

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: images.length > 1, // 只有多于一张图片时才自动播放
    autoplaySpeed: 3000,
  };

  return (
    <div className="realestatepicturecarousel-container">
      <h3 className="realestatepicturecarousel-header">{folder}</h3>
      <h3 className="realestatepicturecarousel-header">{region}</h3>
      {images.length > 0 ? (
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="realestatepicturecarousel-slide">
              <img src={image} alt={`property-${index}`} className="realestatepicturecarousel-carousel-image" />
            </div>
          ))}
        </Slider>
      ) : (
        <div className="realestatepicturecarousel-no-images">没有可用的图片</div>
      )}
    </div>
  );
};

export default RealEstatePictureCarousel;
