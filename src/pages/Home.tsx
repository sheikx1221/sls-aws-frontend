import { observer } from "mobx-react";
import { ProductList } from "../components/products/product";
import { Skeleton } from "../components/products/skeleton";
import { cartStore } from "../stores/cart.store";
import { craftStore } from "../stores/craft.store";

const Home = observer(() => {
  const retrySearch = () => {
    setTimeout(() => {
        craftStore.reloadCrafts();
    }, 800);
  };

  const craftStates = craftStore.getStates();
  const crafts = craftStore.getCrafts();

  return (
    <div className="d-flex flex-column flex-fill">
      <div className="m-3 d-flex flex-column align-items-center">
        <h1>Handicrafts Shop</h1>
        <p className="lead">Unique handmade items from artisans</p>
      </div>
      {craftStates.loading.list && <Skeleton />}
      {craftStates.error.list !== "" && (
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
            <figcaption className="blockquote-footer">{craftStates.error.list}</figcaption>
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
              <ProductList
                key={index}
                item={craft}
                addToCart={cartStore.addItemToCart.bind(cartStore)}
                added={cartStore.checkInCart(craft.craftId)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
})

export default Home;
