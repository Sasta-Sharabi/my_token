// Import the TokenState type for representing the canister's state
use crate::types::TokenState;
// Import stable memory storage functions from IC SDK
use ic_cdk::storage;
// Import RefCell for interior mutability
use std::cell::RefCell;

// ==================== Thread-local Storage ==================== //
// We use thread_local to ensure that the canister's state is safely stored per execution context.
// RefCell allows interior mutability so we can modify the state even though it's in a thread-local static.
thread_local! {
    static STATE: RefCell<Option<TokenState>> = RefCell::new(None);
}

// ==================== Get Current State ==================== //
// Returns the current in-memory state of the canister.
// If the state hasn't been loaded yet, it attempts to restore it from stable memory.
pub fn get_state() -> TokenState {
    STATE.with(|s| {
        match &*s.borrow() {
            Some(state) => state.clone(), // If state is already loaded, return a clone
            None => {
                // Try to restore state from stable memory
                let state = match storage::stable_restore() {
                    Ok((state,)) => state,          // Successfully restored
                    Err(_) => TokenState::default() // Otherwise, use a default empty state
                };
                s.replace(Some(state.clone())); // Save restored state in thread-local memory
                state
            } 
        }
    })
}

// ==================== Save State ==================== //
// Updates the thread-local in-memory state and also persists it to stable memory
pub fn save_state(state: TokenState) {
    // Save to thread-local memory
    STATE.with(|s| s.replace(Some(state.clone())));

    // Persist to stable memory
    storage::stable_save((state,))
        .expect("Some Error Occured while storing data to stable memory.");
}
