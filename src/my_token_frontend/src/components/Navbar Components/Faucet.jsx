import React, { useState } from "react";
import "./Faucet.css";
import faucetIcon from "../../assets/faucet.png"; 
import { useAuth } from "../../AuthProvider";

export default function Faucet() {

  const {callFunction} = useAuth();

  const handleClick = async () =>{
    
      try {
          await callFunction.get_faucets();
          alert(`100 tokens has been credited to your account`)
        } catch (err) {
          console.error("Error fetching balance:", err);
          alert(`Failed to add tokens to your account`);
        } finally {
          setLoading(false);
        }
  }

  return (
    <section className="section-container">
      <div className="faucet-container">
        <img
          src={faucetIcon}
          alt="Faucet Icon"
          className="faucet-icon"
        />
        <h2 className="faucet-title">Token Faucet</h2>
        <p className="faucet-description">
          Need some test tokens? Use the faucet to instantly receive free tokens
          in your wallet for testing transactions.
        </p>
        <button className="faucet-button" onClick={handleClick}>Get Tokens</button>
      </div>
    </section>
  );
}
