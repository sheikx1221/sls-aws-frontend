import './skeleton.scss';

interface Props {
  gridRows: number;
  gridColumns: number;
}
export function Skeleton(props: Props) {
  const { gridRows = 1, gridColumns = 3 } = props as any;

  const cards: number[] = Array.from(
    { length: gridRows * gridColumns },
    (_, i) => i
  );

  return (
    <div className="container py-4">
      <div className="row">
        {cards.map((c) => (
          <div className="col-md-4 mb-4" key={c}>
            <div className="card skeleton-card">
              <div className="skeleton-img-wrapper">
                <div className="skeleton-animate skeleton-img"></div>
                <div className="skeleton-category skeleton-animate"></div>
              </div>
              <div className="card-body d-flex flex-column flex-grow-1">
                <div className="d-flex align-items-center mb-2">
                  <div className="skeleton-line skeleton-animate flex-grow-1"></div>
                  <div className="skeleton-price skeleton-animate"></div>
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
      </div>
    </div>
  );
}
