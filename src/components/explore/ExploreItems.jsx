import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import CountdownTimer from "../CountdownTimer";
import Skeleton from "../UI/Skeleton";
import NftCard from "../UI/NftCard";

const ExploreItems = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("https://us-central1-nft-cloud-functions.cloudfunctions.net/explore")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const filteredData = [...(data || [])];

  if (filter === "price_low_to_high") {
    filteredData.sort((a, b) => a.price - b.price);
  } else if (filter === "price_high_to_low") {
    filteredData.sort((a, b) => b.price - a.price);
  } else if (filter === "likes_high_to_low") {
    filteredData.sort((a, b) => b.likes - a.likes);
  }

  return (
    <>
      <div>
        <select
          id="filter-items"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {loading
        ? Array.from({ length: visibleCount }).map((_, index) => (
            <div
              key={index}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <Skeleton width="40px" height="40px" borderRadius="50%" />
                </div>
                <div className="nft_item_wrap">
                  <Skeleton width="100px" height="200px" borderRadius="12" />
                </div>
                <div className="nft_item_info">
                  <Skeleton width="80%" height="20px" borderRadius="4px" />
                  <Skeleton width="60%" height="16px" borderRadius="4px" />
                </div>
              </div>
            </div>
          ))
        : filteredData.slice(0, visibleCount).map((item) => (
            <div
              key={item.ntfId}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <div className="nft__item">
                <NftCard item={item} />

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
                  <Link to="/item-details">
                    <img
                      src={item.nftImage || nftImage}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to="/item-details">
                    <h4>{item.title}</h4>
                  </Link>
                  <div className="nft__item_price">{item.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      {visibleCount < data?.length && (
        <div className="col-md-12 text-center">
          <Link
            to=""
            id="loadmore"
            className="btn-main lead"
            onClick={() => setVisibleCount((prev) => prev + 4)}
          >
            Load more
          </Link>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
