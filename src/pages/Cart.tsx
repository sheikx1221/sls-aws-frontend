import { observer } from "mobx-react";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cartStore } from "../stores/cart.store";
import type { CartItem } from "../types/cart";
import { Loader } from "../components/common/loader";

const Cart = observer(() => {
    const [cart, setCart] = useState<CartItem[] | null>();
    const cartStates = cartStore.getStates();
    const navigation = useNavigate();

    const totalCart = cartStore.amount;
    const quantityCart = cartStore.quantity;

    const totalTemp = useMemo(() => {
        if (!cart) return 0;
        let sum = 0;
        for (let item of cart) {
            sum = sum + item.amount;
        }
        return sum;
    }, [cart]);

    const quantityTemp = useMemo(() => {
        if (!cart) return 0;
        let sum = 0;
        for (let item of cart) {
            sum = sum + item.qty;
        }
        return sum;
    }, [cart]);

    const hasChanges = () => {
        console.log({ totalCart, totalTemp, quantityCart, quantityTemp });
        if (totalCart !== totalTemp || quantityCart !== quantityTemp) return true;
    };

    const handleCheckout = async () => {};
    const retrySearch = () => {
        getCart();
    };
    const gotoHome = () => {
        navigation("/");
    };

    const getCart = useEffectEvent(async () => {
        const response = await cartStore.getCartItems();
        setCart(Array.isArray(response) ? [...response]: null);
    });
    useEffect(() => {
        getCart();
    }, []);

    const updateCart = async (idx: number, value: number) => {
        if (!cart) return;
        const tmpCart = [...cart];
        const tmpIdx = tmpCart[idx];

        const newQty = value == 0 ? 0 : tmpIdx.qty + value;
        if (newQty < 0) return; // negative qty not allowed

        tmpIdx.qty = newQty;
        tmpIdx.amount = tmpIdx.unitPrice! * newQty;
        tmpCart[idx] = tmpIdx;

        setCart(tmpCart);
    };

    const removeItem = async (idx: number) => {
        if (!cart) return;
        updateCart(idx, 0);
    };

    const restoreItem = async (idx: number) => {
        if (!cart) return;
        updateCart(idx, 1);
    }

    const finishUpdate = async () => {
        if (!cart) return; 
        const newCart = await cartStore.compareAndSave(cart);
        setCart(newCart);
    }

    return (
        <div className="container py-4">
            <h1 className="h4 mb-3">Your Cart</h1>
            {cartStates.loading.get && <div>Loading cart items</div>}
            {cartStates.error.get !== "" && (
                <div style={{ height: "75vh" }} className="d-flex flex-column justify-content-center">
                    <figure className="text-center">
                        <blockquote className="blockquote">
                            <p className="mb-0">Unfortunately, we were not able to load the masterpieces at the moment!</p>
                        </blockquote>
                        <figcaption className="blockquote-footer">{cartStates.error.get}</figcaption>
                        <button onClick={retrySearch} className="btn btn-primary">
                            Let's Retry!
                        </button>
                    </figure>
                </div>
            )}
            {cart && (
                <div className="row">
                    <div className="col-12 col-md-8">
                        {cart.length == 0 && (
                            <div style={{ height: "75vh" }} className="d-flex flex-column justify-content-center">
                                <figure className="text-center">
                                    <blockquote className="blockquote">
                                        <p className="mb-0">Empty Cart</p>
                                    </blockquote>
                                    <figcaption className="blockquote-footer">Let's pick some amazing crafts first!</figcaption>
                                    <button onClick={gotoHome} className="btn btn-primary">
                                        Home
                                    </button>
                                </figure>
                            </div>
                        )}
                        {cart.length > 0 && (
                            <div className="">
                                {cart.map((item, index) => (
                                    <div style={{ height: 200 }} key={index} className="d-flex flex-row align-items-center m-2">
                                        {/* IMAGE | NAME */}
                                        <div style={{ flex: 0.5 }} className="d-flex flex-row gap-4 align-items-center">
                                            <div
                                                style={{
                                                    width: 150,
                                                    height: "100%",
                                                    overflow: "hidden",
                                                    borderRadius: 8,
                                                    flex: "0 0 120px",
                                                    background: "#f8f9fa",
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'relative'
                                                }}
                                            >
                                                <img src={item.craft.image} alt={item.craft.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                                {item.qty === 0 && (
                                                    <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 8 }} />
                                                )}
                                            </div>

                                            <div className="d-flex flex-column justify-content-center">
                                                <p style={{ textDecorationLine: item.qty == 0 ? "line-through" : undefined }} className="lead m-0">
                                                    {item.craft.name}
                                                </p>
                                                <p style={{ textDecorationLine: item.qty == 0 ? "line-through" : undefined }} className="fw-bold text-primary">
                                                    {item.craft.category}
                                                </p>
                                                <div className="mt-2">
                                                    {item.qty == 0 ? (
                                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => restoreItem(index)}>
                                                            Undo
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(index)}>
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ flex: 0.3 }} className="d-flex flex-row gap-3 justify-content-center align-items-center">
                                            <button className="btn btn-secondary" onClick={() => updateCart(index, -1)}>
                                                -
                                            </button>
                                            <input className="form-control text-center" value={item.qty} style={{ width: 72 }} />
                                            <button className="btn btn-primary" onClick={() => updateCart(index, 1)}>
                                                +
                                            </button>
                                        </div>
                                        <div style={{ flex: 0.2 }} className="flex-3">
                                            <p className="text-center fw-bold m-0">$ {item.amount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="p-3">
                            <h5 className="mb-3">Grand Totals</h5>
                            <div className="d-flex justify-content-between">
                                <div className="text-muted">Quantity</div>
                                <div className="fw-bold">{quantityTemp}</div>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <div className="text-muted">Subtotal</div>
                                <div className="fw-bold">${totalTemp.toFixed(2)}</div>
                            </div>
                            <hr />

                            {hasChanges() ? (
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary" onClick={finishUpdate}>
                                        {cartStates.loading.modify
                                            ? <Loader />
                                            : 'Update cart'
                                        }
                                    </button>
                                    <button disabled={true} className="btn btn-success" onClick={handleCheckout}>
                                        Proceed to Checkout
                                    </button>
                                </div>
                            ) : (
                                <div className="d-grid gap-2">
                                    <button className="btn btn-success" onClick={handleCheckout}>
                                        Proceed to Checkout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});
export default Cart;
