import { useEffect, useEffectEvent, useState } from "react";
import { Skeleton } from "../components/skeleton";
import { getCraftsFromAPI } from "../services/home";
import type { Handicrafts } from "../types/handicrafts";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [crafts, setCrafts] = useState<Handicrafts[]>([]);

  const getCrafts = useEffectEvent(async () => {
    const response = await getCraftsFromAPI();
    if ("error" in response) {
      setError(response.error);
    } else {
    }
    setLoading(false);
  });

  useEffect(() => {
    getCrafts();
  }, []);

  const retrySearch = () => {
    setLoading(true);
    setError("");
    setCrafts([]);
    setTimeout(() => {
        getCrafts();
    }, 1500);
  };

  return (
    <div className="d-flex flex-column flex-fill">
        <div className="m-3 d-flex flex-column align-items-center">
            <h1>Handicrafts Shop</h1>
            <p className="lead">Unique handmade items from artisans</p>
        </div>
      {loading && <Skeleton gridColumns={3} gridRows={3} />}
      {error !== "" && (
        <div
          style={{ height: "75vh" }}
          className="d-flex flex-column justify-content-center"
        >
          <figure className="text-center">
            <blockquote className="blockquote">
              <p className="mb-0">
                Unfortunately, we were not able to load the masterpieces at the
                moment!
              </p>
            </blockquote>
            <figcaption className="blockquote-footer">{error}</figcaption>
            <button onClick={retrySearch} className="btn btn-primary">
              Let's Retry!
            </button>
          </figure>
        </div>
      )}
      {crafts.length > 0 && (
        <>
          {crafts.map((craft, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card">
                <div className="skeleton-img-wrapper">
                  <div className="skeleton-animate skeleton-img">
                    <img src={craft.images[0]} />
                  </div>
                  <div className="skeleton-category">
                    <p >{craft.category}</p>
                  </div>
                </div>
                <div className="card-body d-flex flex-column flex-grow-1">
                  <div className="d-flex align-items-center mb-2">
                    <div className="skeleton-line flex-grow-1">
                        {craft.name}
                    </div>
                    <div className="skeleton-price">
                        {"$" + craft.price}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <button className="skeleton-btn gray skeleton-animate">
                      View
                    </button>
                    <button className="skeleton-btn black skeleton-animate">
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
