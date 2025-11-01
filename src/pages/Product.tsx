import { observer } from "mobx-react";
import { useEffect, useEffectEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "../components/carts/skeleton";
import type { CartItem } from "../types/cart";
import type { Handicrafts } from "../types/handicrafts";
import { craftStore } from "../stores/craft.store";
import { cartStore } from "../stores/cart.store";

const Product = observer(() => {
  const params = useParams<{ craftId: string }>();
  const navigation = useNavigate();

  const [qty, setQty] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [craft, setCraft] = useState<Handicrafts | null>();
  const [cartItem, setCartItem] = useState<CartItem | null>();

  const increment = () => setQty((q) => q + 1);
  const decrement = () => setQty((q) => Math.max(1, q - 1));
  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)));
  const resetZoom = () => setZoom(1);

  const cartStates = cartStore.getStates();
  const craftStates = craftStore.getStates();

  const getCraft = useEffectEvent(async () => {
    if (!params.craftId) {
      navigation("/");
    } else {
      const response = await craftStore.getCraft(params.craftId);
      setCraft(response);
    }
  });
  const getCartItem = useEffectEvent(async () => {
    if (params.craftId) {
      const response = await cartStore.getCartItem(params.craftId);
      console.log("appContext.getCartItem response = ", response);
      setCartItem(response);
      if (response) setQty(response.qty);
    }
  });
  useEffect(() => {
    getCraft();
    getCartItem();
  }, []);

  const updateCart = async () => {
    if (cartItem) {
      const response = await cartStore.updateItemInCart(cartItem.cartId, qty);
      if (response) setCartItem(response);
    }
  };

  const addToCart = async () => {
    if (craft) {
      const response = await cartStore.addItemToCart(craft, qty);
      setCartItem(response);
    }
  };

  const removeFromCart = async () => {
    if (cartItem) {
      const response = await cartStore.deleteItemFromCart(cartItem.cartId);
      if (response) {
        navigation("/");
      }
    }
  };

  const retrySearch = () => {
        getCraft();
        getCartItem();
  };

  return (
    <div className="d-flex flex-column flex-fill">
      <div className="m-3 d-flex flex-column align-items-center">
        <h1>Handicrafts Shop</h1>
        <p className="lead">Unique handmade items from artisans</p>
      </div>
      {craftStates.loading.get && <Skeleton />}
      {craftStates.error.get !== "" && (
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
            <figcaption className="blockquote-footer">
              {craftStates.error.get}
            </figcaption>
            <button onClick={retrySearch} className="btn btn-primary">
              Let's Retry!
            </button>
          </figure>
        </div>
      )}
      {craft && (
        <div className="container">
          <div className="row g-4 align-items-start">
            <div className="col-12 col-md-5">
              {/* IMAGE */}
              <div className="">
                <div
                  className="position-relative rounded overflow-hidden bg-light d-flex align-items-center justify-content-center"
                  style={{ height: 360, border: "1px solid #e5e7eb" }}
                >
                  <img
                    src={craft.images[0]}
                    alt={craft.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      transform: `scale(${zoom})`,
                      transition: "transform 180ms ease",
                      transformOrigin: "center center",
                      display: "block",
                    }}
                  />

                  <div
                    className="position-absolute"
                    style={{ right: 8, top: 8 }}
                  >
                    <div className="d-flex flex-column gap-2">
                      <button
                        onClick={zoomIn}
                        aria-label="Zoom in"
                        className="btn btn-sm btn-light border"
                      >
                        +
                      </button>
                      <button
                        onClick={zoomOut}
                        aria-label="Zoom out"
                        className="btn btn-sm btn-light border"
                      >
                        −
                      </button>
                      <button
                        onClick={resetZoom}
                        aria-label="Reset zoom"
                        className="btn btn-sm btn-light border"
                      >
                        1x
                      </button>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Zoom: {zoom.toFixed(2)}x</small>
                  <input
                    type="range"
                    className="form-range"
                    style={{ width: 180 }}
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-7">
              <div
                className="d-flex flex-column justify-content-around"
                style={{ height: 360 }}
              >
                {/* NAME */}
                <div>
                  <h1 className="h4 mb-1 text-white">{craft.name}</h1>
                  <div className="mb-3 text-muted">
                    Category:{" "}
                    <strong className="text-gray">{craft.category}</strong>
                  </div>
                </div>
                {/* CART */}
                <div className="d-flex flex-column justify-content-between flex-fill">
                  <div>
                    <div className="small text-primary fw-bold">Amount</div>
                    <div className="fs-5 fw-bold text-white">
                      ${(qty * craft.price).toFixed(2)}
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="d-flex align-items-center">
                        <button
                          onClick={decrement}
                          aria-label="Decrease quantity"
                          className="btn btn-outline-secondary"
                          style={{ width: 40, height: 40 }}
                        >
                          −
                        </button>
                        <div
                          className="px-3 text-center fw-semibold text-white"
                          style={{ minWidth: 48 }}
                        >
                          {qty}
                        </div>
                        <button
                          onClick={increment}
                          aria-label="Increase quantity"
                          className="btn btn-outline-primary"
                          style={{ width: 40, height: 40 }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="d-flex flex-row gap-2 mb-2">
                      {cartItem ? (
                        <>
                          <button
                            onClick={updateCart}
                            className="btn btn-primary"
                          >
                            {cartStates.loading.update
                              ? "Updating Cart..."
                              : "Update Cart"}
                          </button>
                          <button
                            onClick={removeFromCart}
                            className="btn btn-danger"
                          >
                            {cartStates.loading.delete ? "Remove..." : "Remove"}
                          </button>
                        </>
                      ) : (
                        <button onClick={addToCart} className="btn btn-primary">
                          {cartStates.loading.add
                            ? "Adding to Cart..."
                            : "Add to Cart"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* DESCRIPTION */}
              <div className="row mt-4">
                <div className="">
                  <div
                    className="p-3 rounded"
                    style={{
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <h2 className="h6 mb-2">Description</h2>
                    <p
                      className="mb-0"
                      style={{ lineHeight: 1.6, color: "#374151" }}
                    >
                      {craft.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Product;