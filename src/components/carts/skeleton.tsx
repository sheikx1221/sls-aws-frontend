
export default function Skeleton() {
  return (
    <div className="container">
      <div className="row g-4 align-items-start">
        {/* left: image skeleton */}
        <div className="col-12 col-md-5">
          <div
            className="position-relative rounded overflow-hidden bg-light d-flex align-items-center justify-content-center"
            style={{ height: 360, border: "1px solid #e5e7eb" }}
          >
            <div className="placeholder-glow w-100 h-100 d-flex align-items-center justify-content-center">
              <div className="placeholder col-10" style={{ height: 200, borderRadius: 6 }}></div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-2">
            <small className="text-muted placeholder col-2">&nbsp;</small>
            <div className="placeholder-glow">
              <div className="placeholder col-8" style={{ height: 6 }}></div>
            </div>
          </div>
        </div>

        {/* right: title / category / cart skeleton */}
        <div className="col-12 col-md-7">
          <div className="d-flex flex-column justify-content-around" style={{ height: 360 }}>
            <div>
              <h1 className="h4 mb-1 placeholder col-6 placeholder-lg">&nbsp;</h1>
              <div className="mb-3 text-muted">
                <strong className="text-gray placeholder col-3">&nbsp;</strong>
              </div>
            </div>

            <div className="d-flex flex-column justify-content-between flex-fill">
              <div>
                <div className="small text-primary fw-bold placeholder col-2">&nbsp;</div>
                <div className="fs-5 fw-bold text-white placeholder col-3">&nbsp;</div>
              </div>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="placeholder col-1" style={{ width: 40, height: 40, borderRadius: 6 }}></div>
                    <div className="px-3 text-center fw-semibold placeholder col-1" style={{ minWidth: 48 }}>&nbsp;</div>
                    <div className="placeholder col-1" style={{ width: 40, height: 40, borderRadius: 6 }}></div>
                  </div>
                </div>

                <div className="d-flex flex-row gap-2 mb-2">
                  <div className="placeholder col-3" style={{ height: 38, borderRadius: 6 }}></div>
                  <div className="placeholder col-3" style={{ height: 38, borderRadius: 6 }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* description skeleton */}
          <div className="row mt-4">
            <div className="col-12">
              <div
                className="p-3 rounded bg-white"
                style={{ border: "1px solid #e5e7eb", boxShadow: "0 4px 8px rgba(0,0,0,0.05)" }}
              >
                <h2 className="h6 mb-2 placeholder col-2">&nbsp;</h2>
                <p className="mb-0">
                  <span className="placeholder col-12 d-block mb-2">&nbsp;</span>
                  <span className="placeholder col-10 d-block mb-2">&nbsp;</span>
                  <span className="placeholder col-8 d-block">&nbsp;</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
