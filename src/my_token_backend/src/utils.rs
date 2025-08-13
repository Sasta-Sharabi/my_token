// ==================== Imports ==================== //
use candid::Principal;   // Principal type for Internet Computer accounts
use ic_cdk::caller;      // To get the caller of the canister

// ==================== Utility Functions ==================== //

// Converts a string to u128
// Returns 0 if parsing fails
pub fn convert_from_string_to_u128(amount: String) -> u128 {
    match amount.parse::<u128>() {
        Ok(num) => num,  // Successfully parsed
        Err(_) => 0,     // Invalid input returns 0
    }
}

// Converts a string to Principal
// Returns caller() if parsing fails
pub fn convert_from_string_to_principal(account: String) -> Principal {
    match Principal::from_text(account) {
        Ok(p) => p,      // Successfully parsed
        Err(_) => caller() // Fallback to caller if invalid
    }
}
