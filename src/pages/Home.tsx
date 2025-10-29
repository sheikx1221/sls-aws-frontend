import { useContext } from "react";
import { ProductList } from "../components/products/product";
import { Skeleton } from "../components/products/skeleton";
import { AppContext } from "../providers/app";

export default function Home() {
  const appContext = useContext(AppContext);

  const retrySearch = () => {
    setTimeout(() => {
        appContext.reloadCrafts();
    }, 1500);
  };

  return (
    <div className="d-flex flex-column flex-fill">
      <div className="m-3 d-flex flex-column align-items-center">
        <h1>Handicrafts Shop</h1>
        <p className="lead">Unique handmade items from artisans</p>
      </div>
      {appContext.loading.crafts && <Skeleton />}
      {appContext.error.crafts !== "" && (
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
            <figcaption className="blockquote-footer">{appContext.error.crafts}</figcaption>
            <button onClick={retrySearch} className="btn btn-primary">
              Let's Retry!
            </button>
          </figure>
        </div>
      )}
      {appContext.crafts.length > 0 && (
        <div className="container py-4">
          <div className="row">
            {appContext.crafts.map((craft, index) => (
              <ProductList
                key={index}
                item={craft}
                added={appContext.checkInCart(craft.craftId)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
