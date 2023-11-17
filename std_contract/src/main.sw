// Declaration of what type of program the file contains;
// here, we've declared that this file is a **contract**.
// Could also be:
// - contract
// - predicate
// - script
// - library
// [See more](https://docs.fuel.network/docs/sway/sway-program-types/)
contract;

use std::{
    call_frames::{
        contract_id,
        msg_asset_id,
    },
    context::msg_amount,
    token::{
        mint_to_address,
        transfer_to_address,
    },
};

// Define a storage value with a single counter that we'll call:
// **counter** of type **64-bit unsigned integer** (u64).
storage {
    counter: u64 = 0,
}

// An ABI defines the interface for a contract
// A contract must either define or import an ABI declaration.
abi CounterContract {
    #[storage(read)]
    fn count() -> u64;

    #[payable]
    #[storage(read, write)]
    fn increment();
}

// Below your ABI definition, you will write the implementation of the functions defined in your ABI.
impl CounterContract for Contract {
    #[storage(read)]
    fn count() -> u64 {
        storage.counter.read()
    }

    #[payable]
    #[storage(read, write)]
    fn increment() {
        let incremented = storage.counter.read() + 1;
        storage.counter.write(incremented);
    }
}
