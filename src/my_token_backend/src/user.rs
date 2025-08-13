// ==================== Imports ==================== //
use ic_cdk::{query, update, caller};                 // IC SDK macros and caller info
use crate::state::get_state;                         // Get current canister state
use crate::types::{Transaction, UserData};          // Token-related types
use crate::token::*;                                 // Token functions like transfer, mint
use candid::Principal;                               // Principal type for IC accounts
use crate::utils::{convert_from_string_to_principal, convert_from_string_to_u128}; // Utility functions

// ==================== Query Functions ==================== //

// Returns all users and their balances as a Vec of tuples (Principal, balance)
#[query]
pub fn get_all_users() -> Vec<(String, String)> {
    let state = get_state();
    state.all_users_balance
        .iter()
        .map(|(p, b)| (p.to_text(), b.to_string()))
        .collect()
}

// Returns token metadata: name, symbol, total supply, and minter
#[query]
pub fn get_token_metadata() -> (String, String, String, String) {
    (
        token_name(),
        token_symbol(),
        total_supply().to_string(),
        minter().to_text(),
    )
}

// Returns the profile details of the caller: Principal, name, email, balance
#[query]
pub fn get_profile_details() -> (String, String, String, String) {
    let state = get_state();

    // Get user details; if not registered, return empty strings
    let user = match state.all_user.get(&caller()).cloned() {
        None => UserData { name: "".to_string(), email: "".to_string() },
        Some(user) => user,
    };

    let balance = check_balance(caller());

    (
        caller().to_text(),
        user.name,
        user.email,
        balance.to_string(),
    )
}

// Returns the balance of a given user (by string Principal)
#[query]
pub fn check_balance_of(user: String) -> String {
    let user = Principal::from_text(user).unwrap(); // Convert string to Principal
    check_balance(user).to_string()
}

// ==================== Update Functions ==================== //

// Transfer tokens to another user using string inputs
#[update]
pub fn transfer_to(receiver: String, amount: String) -> String {
    match transfer(convert_from_string_to_principal(receiver), convert_from_string_to_u128(amount)) {
        Ok(_) => "Success".to_string(),
        Err(_) => "Failed".to_string(),
    }
}

// Mint tokens to the caller using string input
#[update]
pub fn mint_tokens(amount: String) -> String {
    match mint(convert_from_string_to_u128(amount), caller()) {
        Ok(_) => "Success".to_string(),
        Err(_) => "Failed".to_string(),
    }
}

// Returns header info for frontend: caller Principal and balance
#[query]
pub fn get_header_details() -> (String, String) {
    (caller().to_text(), check_balance_of(caller().to_text()))
}

// Update the profile details of the caller
#[update]
pub fn update_profile_details(username: String, email: String) {
    update_user_details(username, email);
}

// Register a new user
#[update]
pub fn register_user() {
    new_user();
}

// Claim faucet tokens for the caller
#[update]
pub fn get_faucets() {
    add_faucets();
}

// Fetch all transactions involving the caller
#[query]
pub fn fetch_transactions() -> Vec<Transaction> {
    get_transactions_for(caller())
}
