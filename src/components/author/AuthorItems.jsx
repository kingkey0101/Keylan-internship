import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";

const AuthorItems = () => {
 
  const {id: authorId} = useParams()

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const baseURL =
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors";
    const url = authorId ? `${baseURL}?author=${authorId}` : baseURL;

    console.log('Fetching Url ->', url)

    axios
      .get(url)
      .then((response) => {
        console.log("author api response", response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [authorId]);

  if (loading) return <p>Loading author...</p>;
  if (error) return <p>Error loading author:{error.message}</p>;

  return (
    <div>
      <h2>Author API Payload</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>

    // <div className="de_tab_content">
    //   <div className="tab-1">
    //     <div className="row">
    //       {new Array(8).fill(0).map((_, index) => (
    //         <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
    //           <div className="nft__item">
    //             <div className="author_list_pp">
    //               <Link to="">
    //                 <img className="lazy" src={AuthorImage} alt="" />
    //                 <i className="fa fa-check"></i>
    //               </Link>
    //             </div>
    //             <div className="nft__item_wrap">
    //               <div className="nft__item_extra">
    //                 <div className="nft__item_buttons">
    //                   <button>Buy Now</button>
    //                   <div className="nft__item_share">
    //                     <h4>Share</h4>
    //                     <a href="" target="_blank" rel="noreferrer">
    //                       <i className="fa fa-facebook fa-lg"></i>
    //                     </a>
    //                     <a href="" target="_blank" rel="noreferrer">
    //                       <i className="fa fa-twitter fa-lg"></i>
    //                     </a>
    //                     <a href="">
    //                       <i className="fa fa-envelope fa-lg"></i>
    //                     </a>
    //                   </div>
    //                 </div>
    //               </div>
    //               <Link to="/item-details">
    //                 <img
    //                   src={nftImage}
    //                   className="lazy nft__item_preview"
    //                   alt=""
    //                 />
    //               </Link>
    //             </div>
    //             <div className="nft__item_info">
    //               <Link to="/item-details">
    //                 <h4>Pinky Ocean</h4>
    //               </Link>
    //               <div className="nft__item_price">2.52 ETH</div>
    //               <div className="nft__item_like">
    //                 <i className="fa fa-heart"></i>
    //                 <span>97</span>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
  );
};

export default AuthorItems;
