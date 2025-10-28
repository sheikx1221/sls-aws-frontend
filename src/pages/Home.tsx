import { useEffect, useEffectEvent, useState } from "react";
import { Skeleton } from "../components/products/skeleton";
import { getCraftsFromAPI } from "../services/home";
import type { Handicrafts } from "../types/handicrafts";
import { ProductList } from "../components/products/product";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [crafts, setCrafts] = useState<Handicrafts[]>([]);

  const getCrafts = useEffectEvent(async () => {
    const response = await getCraftsFromAPI();
    if ("error" in response) {
      setError(response.error);
    } else {
        setCrafts(response);
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
      {loading && <Skeleton />}
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
        <div className="container py-4">
          <div className="row">
            {crafts.map((craft, index) => (
                <ProductList key={index} item={craft} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
