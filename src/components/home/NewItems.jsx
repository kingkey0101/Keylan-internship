import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";
import Skeleton from "../UI/Skeleton";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../css/HotCollections.css";

const useCountdown = (expiryDate) => {
  const [timeLeft, setTimeLeft] = useState("");
  const intervalRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    if (!expiryDate) return;
    const target = new Date(expiryDate).getTime();
    intervalRef.current = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff < 0) {
        if (isMounted.current) setTimeLeft("Expired");
        clearInterval(intervalRef.current);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      if (isMounted.current) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => {
      isMounted.current = false;
      clearInterval(intervalRef.current);
    };
  }, [expiryDate]);
  return timeLeft;
};

const NewItems = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    axios
      .get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
      )
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="section-items" className="no-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <h2>New Items</h2>
                <div className="small-border bg-color-2"></div>
              </div>
            </div>
            <div className="col-12 slider__container">
              <Slider {...settings}>
                {[...Array(7)].map((_, index) => (
                  <div
                    className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                    key={index}
                  >
                    <Skeleton width="100%" height="300px" borderRadius="12px" />
                    <div className="author_list_pp">
                      <Skeleton width="40px" height="40px" borderRadius="50%" />
                      <div className="nft__item_wrap">
                        <Skeleton
                          width="80%"
                          height="20px"
                          borderRadius="4px"
                        />
                      </div>
                      <div className="nft__item_info">
                        <Skeleton
                          width="60%"
                          height="16px"
                          borderRadius="4px"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <section id="section-items" className="no-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <h2>New Items</h2>
                <div className="small-border bg-color-2"></div>
              </div>
            </div>
            {data && (
              <div className="col-12 slider__container">
                <Slider {...settings}>
                  {data.slice(0, 6).map((item, index) => {
                    const timeLeft = useCountdown(item.expiryDate);
                    return (
                      <div key={index}>
                        <div className="nft__item">
                          <div className="author_list_pp">
                            <Link
                              to={`/author/${item.authorId}`}
                              title={`Creator:${item.authorName}`}
                            >
                              <img
                                className="lazy"
                                src={item.authorImage || AuthorImage}
                                alt=""
                              />
                              <i className="fa fa-check"></i>
                            </Link>
                          </div>

                          {item.expiryDate && (
                            <div className="de_countdown">{timeLeft}</div>
                          )}
                          <div className="nft__item_wrap">
                            <div className="nft__item_extra">
                              <div className="nft__item_buttons">
                                <button>Buy Now</button>
                                <div className="nft__item_share">
                                  <h4>Share</h4>
                                  <a href="" target="_blank" rel="noreferrer">
                                    <i className="fa fa-facebook fa-lg"></i>
                                  </a>
                                  <a href="" target="_blank" rel="noreferrer">
                                    <i className="fa fa-twitter fa-lg"></i>
                                  </a>
                                  <a href="">
                                    <i className="fa fa-envelope fa-lg"></i>
                                  </a>
                                </div>
                              </div>
                            </div>

                            <Link to={`/item-details/${item.nftId}`}>
                              <img
                                src={item.nftImage || nftImage}
                                className="lazy nft__item_preview"
                                alt={item.title}
                              />
                            </Link>
                          </div>
                          <div className="nft__item_info">
                            <Link to={`/item-details/${item.nftId}`}>
                              <h4>{item.title || "Untitled"}</h4>
                            </Link>
                            <div className="nft__item_price">{item.price}</div>
                            <div className="nft__item_like">
                              <i className="fa fa-heart"></i>
                              <span>{item.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default NewItems;
