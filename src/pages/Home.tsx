import { useEffect, useEffectEvent, useState } from "react";
import { Skeleton } from "../components/skeleton";

const getCraftsAPI = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
                resolve(true);
        }, 50000);
    })
}

export default function Home() {
    const [loading, setLoading] = useState(true);
  const crafts = useEffectEvent(async () => {

    const getCrafts = await getCraftsAPI();
    setLoading(false);
  });

  useEffect(() => {
    crafts();
  }, []);

  return (
    <div >
        <h1>Handicrafts Shop</h1>
        <p className="lead">Unique handmade items from artisans</p>
        {loading && (
            <Skeleton gridColumns={3} gridRows={3}/>
        )}
    </div>
  );
}
