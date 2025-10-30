import { useContext, useEffect, useEffectEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../providers/app";
import type { Handicrafts } from "../types/handicrafts";

export function Product() {
  const params = useParams<{ craftId: string }>();
  const appContext = useContext(AppContext);
  const navigation = useNavigate();

  const [qty, setQty] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [craft, setCraft] = useState<Handicrafts | null>();

  const increment = () => setQty((q) => q + 1);
  const decrement = () => setQty((q) => Math.max(1, q - 1));
  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)));
  const resetZoom = () => setZoom(1);

  const getCraft = useEffectEvent(async () => {
    if (!params.craftId) {
      navigation("/");
    } else {
      const response = await appContext.getCraft(params.craftId);
      setCraft(response);
    }
  });
  useEffect(() => {
    getCraft();
  }, []);

  const retrySearch = () => {
    
  }

  return (
    <div className="d-flex flex-column flex-fill">
      <div className="m-3 d-flex flex-column align-items-center">
        <h1>Handicrafts Shop</h1>
        <p className="lead">Unique handmade items from artisans</p>
      </div>
      {appContext.loading.craft && <div style={{ padding: 20 }}>Loading product...</div>}
      {appContext.error.craft !== "" && (
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
              {appContext.error.crafts}
            </figcaption>
            <button onClick={retrySearch} className="btn btn-primary">
              Let's Retry!
            </button>
          </figure>
        </div>
      )}
      {craft && (
        <div
          className="container py-4"
          style={{ fontFamily: "system-ui, sans-serif", color: "#111" }}
        >
          <div className="row g-4 align-items-start">
            {/* Image */}
            <div className="col-12 col-md-5">
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

                <div className="position-absolute" style={{ right: 8, top: 8 }}>
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

              <div className="d-flex justify-content-between align-items-center mt-2">
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
            {/* Product */}
            <div className="d-flex flex-column col-12 col-md-7 justify-content-around">
              <h1 className="h4 mb-1 text-white">{craft.name}</h1>
              <div className="mb-3 text-muted">
                Category:{" "}
                <strong className="text-gray">{craft.category}</strong>
              </div>

              <div>
                <div className="small text-primary fw-bold">Amount</div>
                <div className="fs-5 fw-bold text-white">
                  ${(craft.price * qty).toFixed(2)}
                </div>
              </div>

              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center">
                  <button
                    onClick={decrement}
                    aria-label="Decrease quantity"
                    className="btn btn-secondary"
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
                    className="btn btn-primary"
                    style={{ width: 40, height: 40 }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <button className="btn btn-dark">Add to Cart</button>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
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
      )}
    </div>
  );
}