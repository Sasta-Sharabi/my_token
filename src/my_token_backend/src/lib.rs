// Import internal modules for state management, types, token logic, user handling, and utilities
mod state;
mod types;
mod token;
mod user;
mod utils;

// Standard library import for using HashMap
use std::collections::HashMap;

// Import macros and functions from the Internet Computer SDK
use ic_cdk::{ caller, init, post_upgrade, pre_upgrade, storage };

// Import state management functions and types from local modules
use crate::state::{get_state, save_state};
use crate::types::{TokenState, UserData};

// ==================== Pre-upgrade Hook ==================== //
// This function is called automatically before the canister is upgraded.
// We save the current state to stable memory so it can be restored after upgrade.
#[pre_upgrade]
fn pre_upgrade() {  
    let state = get_state(); // Get the current state from memory
    save_state(state);       // Save it to stable storage
}

// ==================== Post-upgrade Hook ==================== //
// This function is called automatically after the canister is upgraded.
// It restores the saved state from stable memory.
#[post_upgrade]
fn post_upgrade() {
    // Attempt to restore the state from stable storage
    let state: TokenState = match storage::stable_restore() {
        Ok((state,)) => state,         // Successfully restored
        Err(_) => TokenState::default(), // If failed, use a default state
    };
    
    save_state(state); // Save restored state back to memory
}

// ==================== Initialization ==================== //
// This function runs once when the canister is first deployed
#[init]
fn init() {

    // Get the principal (caller) who deployed the canister
    let minter = caller();

    // Create admin user details
    let admin_details = UserData{
        name : "Admin".to_string(),
        email : "minter404@gmail.com".to_string()
    };

    // Initialize HashMap to store all users
    let mut all_user = HashMap::new();
    all_user.insert(minter.clone(), admin_details); // Insert admin user

    // Initialize HashMap to store user balances
    let mut all_user_balance = HashMap::new();
    all_user_balance.insert(minter.clone(), 90000000000); // Admin gets initial balance

    // ==================== Example Fake Users ====================
    // Uncomment these lines to add test users with initial balances
    /*
    let id1 = convert_from_string_to_principal("pyq3t-asn73-vg45r-dnltz-whebg-hujyt-tlvhp-wqeno-6f3zy-jghzt-lae".to_string());
    all_user.insert(id1.clone(), UserData { name: "FakeId1".to_string(), email: "FakeId1@gmail.com".to_string() });
    all_user_balance.insert(id1.clone(), 5000000000);

    let id2 = convert_from_string_to_principal("dt2iq-xbhe7-acf5e-tau4p-qzsyl-n7476-ghw2c-rtfux-q2uiz-ja4tf-gae".to_string());
    all_user.insert(id2.clone(), UserData { name: "FakeId2".to_string(), email: "FakeId2@gmail.com".to_string() });
    all_user_balance.insert(id2.clone(), 5000000000);
    */

    // ==================== Initialize Token State ====================
    let state = TokenState {
        total_supply: 90000000000,           // Total token supply
        all_user: all_user,                  // All registered users
        all_users_balance: all_user_balance, // Balances of all users
        minting_account: Some(minter),       // Account allowed to mint new tokens
        airdrop_milestone: 5,                // Number of users needed for airdrop
        transactions: Vec::new()             // Empty list to store transaction history
    };

    // Save the initial state to memory
    save_state(state);
}
