import { useState } from "react";
import type { Handicrafts } from "../../types/handicrafts";
import "./skeleton.scss";
import { addToCart } from "../../services/cart";
import { useNavigate } from "react-router-dom";

interface Props {
  item: Handicrafts;
}
export function ProductList(props: Props) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const onViewProduct = () => {
    
  }
  const onAddToCart = async () => {
    setLoading(true);
    const response = await addToCart(props.item.craftId, props.item.price);
    if (response) setAdded(true);
    setLoading(false);
  }

  return (
    <div className="col-md-3 mb-3">
      <div className="card">
        <div className="skeleton-img-wrapper">
          <div className="skeleton-img">
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "fill",
              }}
              src={props.item.images[0]}
            />
          </div>
          <div
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            className="skeleton-category"
          >
            <p className="text-white m-0 text-center">{props.item.category}</p>
          </div>
        </div>
        <div className="card-body d-flex flex-column flex-grow-1">
          <div className="d-flex align-items-center mb-2">
            <div className="skeleton-line flex-grow-1">{props.item.name}</div>
            <div className="skeleton-price">{"$" + props.item.price}</div>
          </div>
          <div className="mt-auto">
            <button
              onClick={onViewProduct}
              className="skeleton-btn gray text-black"
            >
              View
            </button>
            <button
              onClick={onAddToCart}
              className="skeleton-btn black text-white btn"
            >
                {loading
                    ? 'Adding to cart...'
                    : added
                        ? 'Open cart'
                        : 'Add to cart'
                }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
