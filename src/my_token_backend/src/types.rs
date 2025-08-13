// ==================== Imports ==================== //
// Candid types for interacting with Internet Computer canisters
use candid::{CandidType, Principal};
// Serde for serialization/deserialization
use serde::{Deserialize, Serialize};
// Standard library HashMap to store users and balances
use std::collections::HashMap;

// ==================== Error Enum ==================== //
// Enum to represent possible errors in token operations
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub enum Errors {
    InsufficientFunds { balance: u128 }, // Not enough tokens to perform transfer
    ReceiverSameAsSender,                 // Sender and receiver are the same
    ZeroTransfer,                         // Attempted transfer of zero tokens
    MinterNotSet,                         // No minting account set
    NotTheMinter                          // Caller is not authorized to mint tokens
}

// ==================== User Data ==================== //
// Struct to store information about a user
#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct UserData {
    pub name: String,  // User's name
    pub email: String, // User's email
}

// ==================== Token State ==================== //
// Represents the full state of the token canister
#[derive(CandidType, Deserialize, Serialize, Clone, Default)]
pub struct TokenState {
    pub total_supply: u128,                        // Total number of tokens in existence
    pub all_user: HashMap<Principal, UserData>,    // Map of all users by their Principal
    pub all_users_balance: HashMap<Principal, u128>, // Map of all users' balances
    pub minting_account: Option<Principal>,        // Optional account allowed to mint new tokens
    pub airdrop_milestone: u128,                  // Number of users required to trigger airdrop
    pub transactions: Vec<Transaction>,           // List of all transactions
}

// ==================== Transaction Struct ==================== //
// Represents a single token transaction
#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct Transaction {
    pub from: Principal,   // Sender of the transaction
    pub to: Principal,     // Receiver of the transaction
    pub amount: u128,      // Amount of tokens transferred
    pub timestamp: u64,    // Unix timestamp of the transaction
    pub tx_type: String,   // Type of transaction, e.g., "airdrop", "transfer", "faucet"
}
