import { useEffect } from 'react'
import fingerprint from '../utils/fingerprint';

export default function Home() {
  useEffect(() => {
    fingerprint;
}, []);

  return (
    <div className="container py-4">
      <h1>Handicrafts Shop</h1>
      <p className="lead">Unique handmade items from artisans</p>
    </div>
  )
}
