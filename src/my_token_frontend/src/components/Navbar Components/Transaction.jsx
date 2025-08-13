import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthProvider";
import giftIcon from "../../assets/drop.png";
import transferIcon from "../../assets/transfer.png";
import mintIcon from "../../assets/mint.png";
import faucetIcon from "../../assets/faucet.png";
import "./Transaction.css";

const Transaction = () => {
  const { callFunction, principal } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (principal) {
      fetchTransactions();
    }
  }, [principal]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const txList = await callFunction.get_transactions_for(principal);
      console.log("Transactions fetched:", txList);
      setTransactions(txList);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (nanoTime) => {
    try {
      const date = new Date(Number(nanoTime / BigInt(1_000_000))); 
      return date.toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "AirDrop":
        return giftIcon;
      case "Mint":
        return mintIcon;
      case "Transfer":
        return transferIcon;
      default:
        return faucetIcon;
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case "AirDrop":
        return "bg-green-100 text-green-700";
      case "Mint":
        return "bg-purple-100 text-purple-700";
      case "Transfer":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="transaction-section">
      <div className="transaction-card">
        <h2 className="transaction-title">Transaction History</h2>

        {loading ? (
          <p className="transaction-loading">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="transaction-empty">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr key={idx}>
                    <td className="type-cell">
                      <img
                        src={getIcon(tx.tx_type)}
                        alt={tx.tx_type}
                        className="type-icon"
                      />
                      <span className={`type-badge ${getTypeStyle(tx.tx_type)}`}>
                        {tx.tx_type}
                      </span>
                    </td>
                    <td title={tx.from.toString()}>{tx.from.toString()}</td>
                    <td title={tx.to.toString()}>{tx.to.toString()}</td>
                    <td>{tx.amount.toString()}</td>
                    <td>{formatDate(tx.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;
