import React, { useContext } from "react";
import CartContext from "../store/CartContext";
import Modal from "./UI/Modal";
import UserProgressContext from "../store/UserProgressContext";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import Input from "./UI/Input";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};
const Checkout = () => {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const cartTotal = cartCtx.items.reduce((totalPrice, item) => {
    return totalPrice + item.price * item.quantity;
  }, 0);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData ,
  } = useHttp("http://localhost:3000/orders", requestConfig);

  function handleCloseCheckout() {
    userProgressCtx.hideCart();
  }
  function handleShowCart() {
    userProgressCtx.showCart();
  }
  function handleFinish () {
    userProgressCtx.hideCheckout()
    cartCtx.clearCart()
    clearData()
  }
  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());

    sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleCloseCheckout}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending order data...</span>;
  }

  if (data && !error) {
    return (
      <Modal
        className="cart"
        open={userProgressCtx.progress === "checkout"}
        onClose={handleFinish}
      >
        <h2>Succes!</h2>
        <p>Yor order was submitted successfully.</p>
        <p>
          We will get back to you with more details via email within the next
          few minutes
        </p>
        <p className="modal-actions">
          <Button onClick={handleFinish}> Okay</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      className="cart"
      open={userProgressCtx.progress === "checkout"}
      onClose={userProgressCtx.progress === "checkout" ? handleShowCart : null}
    >
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount : {currencyFormatter.format(cartTotal)} </p>

        <Input label="Full Name" type="text" id="name" />
        <Input label="E-Mail Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>
        {error && <Error title="Failed to submit orrder" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
};

export default Checkout;
