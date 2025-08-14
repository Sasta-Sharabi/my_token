// ==================== Imports ==================== //
use ic_cdk::{caller, query, update};                     // IC SDK for caller info, query & update methods
use crate::state::{get_state, save_state};              // Functions to manage canister state
use crate::types::{Errors, Transaction, UserData};      // Token-related types
use crate::utils::convert_from_string_to_principal;     // Utility to convert string -> Principal
use candid::Principal;                                   // Principal type for IC accounts

// ==================== Query Functions ==================== //
// Return the name of the token
#[query]
pub fn token_name() -> String {
    "CoreX".to_string()
}

// Return the symbol of the token
#[query]
pub fn token_symbol() -> String {
    "CRX".to_string()
}

// Return the total token supply
#[query]
pub fn total_supply() -> u128 {
    let state = get_state();
    state.total_supply
}

// Return the balance of a given account
#[query]
pub fn check_balance(account: Principal) -> u128 {
    let state = get_state();
    match state.all_users_balance.get(&account).cloned() {
        None => 0,          // If account not found, return 0
        Some(num) => num,
    }
}

// Return the minting account; if not set, return caller
#[query]
pub fn minter() -> Principal {
    match get_state().minting_account {
        None => caller(),
        Some(num) => num,
    }
}

// ==================== Update Functions ==================== //
// Transfer tokens from caller to receiver
#[update]
pub fn transfer(receiver: Principal, amount: u128) -> Result<u128, Errors> {

    // Validate transfer
    if amount == 0 { return Err(Errors::ZeroTransfer); }
    if receiver == caller() { return Err(Errors::ReceiverSameAsSender); }

    let mut state = get_state();
    let balance = check_balance(caller());

    if balance < amount {
        return Err(Errors::InsufficientFunds { balance });
    }

    // Update balances
    state.all_users_balance.insert(caller(), balance - amount);
    let receiver_balance = check_balance(receiver);
    state.all_users_balance.insert(receiver.clone(), receiver_balance + amount);

    // Record transaction
    state.transactions.push(Transaction{
        from: caller(),
        to: receiver,
        amount,
        timestamp: ic_cdk::api::time(),
        tx_type: "Transfer".to_string(),
    });

    save_state(state);

    Ok(balance - amount) // Return remaining balance
}

// Mint new tokens to a specific account
#[update]
pub fn mint(amount: u128, account: Principal) -> Result<u128, Errors> {
    let mut state = get_state();

    // Only minter can mint
    if minter() != caller() { return Err(Errors::NotTheMinter); }
    if amount == 0 { return Err(Errors::ZeroTransfer); }

    let curr_balance = check_balance(account);
    state.all_users_balance.insert(account.clone(), curr_balance + amount);
    state.total_supply += amount;

    // Record mint transaction
    state.transactions.push(Transaction{
        from: convert_from_string_to_principal("".to_string()), // "null" sender
        to: account,
        amount,
        timestamp: ic_cdk::api::time(),
        tx_type: "Mint".to_string(),
    });

    save_state(state);

    Ok(1)
}

// Update user details (name, email) for caller
#[update]
pub fn update_user_details(username: String, email: String){
    let mut state = get_state();
    state.all_user.insert(caller(), UserData { name: username, email });
    save_state(state);
}

// Register a new user and handle airdrop if milestone reached
#[update]
pub fn new_user() {
    let mut state = get_state();

    //avoid anonymous principal getting registered
    if caller() == Principal::anonymous() {return}

    // Prevent duplicate registration
    if state.all_user.contains_key(&caller()) || state.all_users_balance.contains_key(&caller()) {
        return;
    }

    // Add new user with empty details and zero balance
    state.all_user.insert(caller(), UserData { name: "".to_string(), email: "".to_string() });
    state.all_users_balance.insert(caller(), 0);

    let total_users = state.all_user.len() as u128;

    // Trigger airdrop if milestone reached
    if total_users == state.airdrop_milestone {
        let airdrop_amount: u128 = 60_000;
        let total_airdrop_tokens = airdrop_amount * total_users;

        // Mint tokens for airdrop
        state.total_supply += total_airdrop_tokens;

        // Update minter's balance temporarily
        let minter_balance = check_balance(minter()) + total_airdrop_tokens;
        state.all_users_balance.insert(minter(), minter_balance - total_airdrop_tokens);

        // Distribute airdrop to all users and record transactions
        for user in state.all_user.keys() {
            let curr_balance = check_balance(*user);
            state.all_users_balance.insert(*user, curr_balance + airdrop_amount);
            state.transactions.push(Transaction{
                from: convert_from_string_to_principal("".to_string()), // "null" sender
                to: *user,
                amount: airdrop_amount,
                timestamp: ic_cdk::api::time(),
                tx_type: "AirDrop".to_string(),
            });
        }

        // Double the milestone for next airdrop
        state.airdrop_milestone *= 2;
    }

    save_state(state);
}

// Faucet: gives caller 100 tokens from minter
#[update]
pub fn add_faucets(){
    let mut state = get_state();

    // Update caller balance
    let curr_balance = check_balance(caller());
    state.all_users_balance.insert(caller(), curr_balance + 100);

    // Deduct from minter
    let minter = match state.minting_account { None => caller(), Some(p) => p };
    let minter_balance = check_balance(minter);
    state.all_users_balance.insert(minter, minter_balance - 100);

    // Record faucet transaction
    state.transactions.push(Transaction{
        from: minter,
        to: caller(),
        amount: 100,
        timestamp: ic_cdk::api::time(),
        tx_type: "Faucets".to_string(),
    });

    save_state(state);
}

// Return all transactions related to a given account
#[query]
pub fn get_transactions_for(account: Principal) -> Vec<Transaction> {
    let state = get_state();
    state.transactions
        .iter()
        .filter(|tx| tx.from == account || tx.to == account) // Filter relevant transactions
        .cloned()
        .collect()
}
