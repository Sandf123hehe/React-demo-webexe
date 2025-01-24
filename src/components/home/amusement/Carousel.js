// src/components/Carousel.js
import React, { useState, useRef, useEffect } from 'react';
import './Carousel.css'; // 确保这个路径正确
 

 
 
//src={currentIndex === 0 ? images[images.length - 2] : images[(currentIndex - 1 + images.length) % images.length]} 
//src={currentIndex === images.length - 1 ? images[1] : images[(currentIndex + 1) % images.length]} // 当是最后一张时，跳到第二张

// 图片源
const imagesleft = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/1.jpg', //此处将第一张多增加一张用来过度动画
];
const imagescenter = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/1.jpg', //此处多增加一张用来过度动画
];
const imagesright = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/1.jpg', //此处多增加一张用来过度动画
];


export default function Carousel() {
   
   

  const [currentIndexleft, setCurrentIndexleft] = useState(0);
  const [currentIndexcenter, setCurrentIndexcenter] = useState(1);
  const [currentIndexright, setCurrentIndexright] = useState(2);

  const [transitionDurationleft, setTransitionDurationleft] = useState('1.0s'); // 默认过渡时间
  const [transitionDurationcenter, setTransitionDurationcenter] = useState('1.0s'); // 默认过渡时间
  const [transitionDurationright, setTransitionDurationright] = useState('1.0s'); // 默认过渡时间
  // 去重后的图片数组（去除重复的图片）
  const uniqueImagescenter = [...new Set(imagescenter)];
  //const uniqueImagescenter =imagescenter;
  
  // 切换到下一张图片
  const nextImage = () => {
    if (currentIndexleft === imagesleft.length - 1) {
      //console.log('当前序号是:', currentIndexleft); // 打印当前序号
      // 如果是倒数第1张图片，立即回到第一张，并且过渡时间为0
      setTransitionDurationleft('0s'); // 设置过渡时间为0
      setCurrentIndexleft(0); // 立即切换到第一张

      // 延迟切换到第二张图片
      setTimeout(() => {
        setCurrentIndexleft(1); // 0.5秒后切换到第二张图片
        setTransitionDurationleft('1.0s'); // 恢复过渡时间为正常的0.5秒
      }, 0); // 0毫秒后切换第二张图片
     
    } else {
      // 否则，正常切换到下一张
      //console.log('当前序号是:', currentIndexleft); // 打印当前序号
      setCurrentIndexleft((prevIndex) => (prevIndex + 1) % imagesleft.length);
     // console.log('当前序号是:', currentIndexleft); // 打印当前序号
    }
    
    if (currentIndexcenter === imagescenter.length - 1) {
      // 如果是倒数第1张图片，立即回到第一张，并且过渡时间为0
      setTransitionDurationcenter('0s'); // 设置过渡时间为0
      setCurrentIndexcenter(0); // 立即切换到第一张

      // 延迟切换到第二张图片
      setTimeout(() => {
        setCurrentIndexcenter(1); // 0.5秒后切换到第二张图片
        setTransitionDurationcenter('1.0s'); // 恢复过渡时间为正常的0.5秒
      }, 0); // 0毫秒后切换第二张图片
    } else {
      // 否则，正常切换到下一张
      setCurrentIndexcenter((prevIndex) => (prevIndex + 1) % imagescenter.length);
    }

    if (currentIndexright === imagesright.length - 1) {
      // 如果是倒数第1张图片，立即回到第一张，并且过渡时间为0
      setTransitionDurationright('0s'); // 设置过渡时间为0
      setCurrentIndexright(0); // 立即切换到第一张

      // 延迟切换到第二张图片
      setTimeout(() => {
        setCurrentIndexright(1); // 0.5秒后切换到第二张图片
        setTransitionDurationright('1.0s'); // 恢复过渡时间为正常的0.5秒
      }, 0); // 0毫秒后切换第二张图片
    } else {
      // 否则，正常切换到下一张
      setCurrentIndexright((prevIndex) => (prevIndex + 1) % imagesright.length);
    }

  };

  // 切换到上一张图片
  const prevImage = () => {

    if (currentIndexleft === 0) {
      // 如果是第一张图片，倒数第一张，并且过渡时间为0
      setTransitionDurationleft('0s'); // 设置过渡时间为0
      setCurrentIndexleft(imagesleft.length - 1); // 立即切换到倒数第1张图片

      // 延迟切换到第三张图片
      setTimeout(() => {
        setCurrentIndexleft(imagesleft.length - 2); // 0.5秒后切换到第2张图片
        setTransitionDurationleft('1.0s'); // 恢复过渡时间为正常的0.5秒
      }, 0); // 0毫秒后切换到第2张
    } else {
      // 否则，正常切换到上一张
      setCurrentIndexleft((prevIndex) => (prevIndex - 1 + imagesleft.length) % imagesleft.length);
    }


    if (currentIndexcenter === 0) {
      // 如果是第一张图片，倒数第一张，并且过渡时间为0
      setTransitionDurationcenter('0s'); // 设置过渡时间为0
      setCurrentIndexcenter(imagescenter.length - 1); // 立即切换到倒数第1张图片

      // 延迟切换到第三张图片
      setTimeout(() => {
        setCurrentIndexcenter(imagescenter.length - 2); // 0.5秒后切换到第2张图片
        setTransitionDurationcenter('1.0s'); // 恢复过渡时间为正常的0.5秒
      }, 0); // 0毫秒后切换到第2张
    } else {
      // 否则，正常切换到上一张
      setCurrentIndexcenter((prevIndex) => (prevIndex - 1 + imagescenter.length) % imagescenter.length);
    }

    if (currentIndexright === 0) {
      // 如果是第一张图片，倒数第一张，并且过渡时间为0
      setTransitionDurationright('0s'); // 设置过渡时间为0
      setCurrentIndexright(imagesright.length - 1); // 立即切换到倒数第1张图片

      // 延迟切换到第三张图片
      setTimeout(() => {
        setCurrentIndexright(imagesright.length - 2); // 0.5秒后切换到第2张图片
        setTransitionDurationright('1.0s'); // 恢复过渡时间为正常的0.5秒
      }, 0); // 0毫秒后切换到第2张
    } else {
      // 否则，正常切换到上一张
      setCurrentIndexright((prevIndex) => (prevIndex - 1 + imagesright.length) % imagesright.length);
    }
  };

  return (
    <div className="carousel-container">

      <div className="carousel-container-left">
        <div className="carousel">
          {/* 左侧按钮 */}
          <button className="prev" onClick={prevImage}>
            &lt;
          </button>

          {/* 图片容器 */}
          <div className="carousel-wrapper">
            <div
              className="carousel-images"
              style={{
                transform: `translateX(-${currentIndexleft * 264}px)`,
                transition: `transform ${transitionDurationleft} ease-in-out`, // 动态设置过渡时间
              }}
            >
              {imagesleft.map((imageleft, indexleft) => (
                <img
                  key={indexleft}
                   src={imageleft}
                  alt={`Carousel Image ${currentIndexleft}`}
                  className="carousel-image"
                />
              ))}
            </div>
          </div>




        </div>
      </div>

      <div className="carousel-container-center">
        <div className="carousel">
          {/* 左侧按钮 */}
          {/* <button className="prev" onClick={prevImage}>
            &lt;
          </button> */}

          {/* 图片容器 */}
          <div className="carousel-wrapper">
            <div
              className="carousel-images"
              style={{
                transform: `translateX(-${currentIndexcenter * 672}px)`,
                transition: `transform ${transitionDurationcenter} ease-in-out`, // 动态设置过渡时间
              }}
            >
              {imagescenter.map((imagecenter, indexcenter) => (
                <img
                  key={indexcenter}
                  src={imagecenter}
                  alt={`Carousel Image ${currentIndexcenter + 1}`}
                  className="carousel-image"
                />
              ))}
            </div>
          </div>

          {/* 右侧按钮 */}
          {/* <button className="next" onClick={nextImage}>
            &gt;
          </button> */}

          {/* 小圆点 */}
          <div className="carousel-dots">
            {uniqueImagescenter.map((_, indexcenter) => (
              <span
                key={indexcenter}
                className={`dot ${currentIndexcenter === indexcenter || (currentIndexcenter === imagescenter.length - 1 && indexcenter === 0) ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndexcenter(indexcenter);
                  setCurrentIndexleft(indexcenter === 0 ? imagesleft.length - 2 : indexcenter - 1); // 更新左侧索引
                  setCurrentIndexright(indexcenter === imagesright.length - 1 ? 0 : indexcenter + 1); // 更新右侧索引
                }}
                onMouseEnter={() => {
                  setCurrentIndexcenter(indexcenter);
                  setCurrentIndexleft(indexcenter === 0 ? imagesleft.length - 2 : indexcenter - 1); // 更新左侧索引
                  setCurrentIndexright(indexcenter === imagesright.length - 1 ? 0 : indexcenter + 1); // 更新右侧索引
                }}
                // 悬浮触发事件
              ></span>
            ))}
          </div>
        </div>
      </div>

      <div className="carousel-container-right">
        <div className="carousel">
          {/* 左侧按钮 */}
          {/* <button className="prev" onClick={prevImage}>
            &lt;
          </button> */}

          {/* 图片容器 */}
          <div className="carousel-wrapper">
            <div
              className="carousel-images"
              style={{
                transform: `translateX(-${currentIndexright * 264}px)`,
                transition: `transform ${transitionDurationright} ease-in-out`, // 动态设置过渡时间
              }}
            >
              {imagesright.map((imageright, indexright) => (
                <img
                  key={indexright}
                  src={imageright}
                  alt={`Carousel Image ${currentIndexright + 2}`}
                  className="carousel-image"
                />
                //src={image}
                //src={currentIndex === images.length - 1 ? images[1] : images[(currentIndex + 1) % images.length]} // 当是最后一张时，跳到第二张
              ))}
            </div>
          </div>

          {/* 右侧按钮 */}
          <button className="next" onClick={nextImage}>
            &gt;
          </button>




        </div>
      </div>
    </div>
  );
}
