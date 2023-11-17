# Testing

- Let's generate our test harness for testing our contract.

```bash
cargo generate --init fuellabs/sway templates/sway-test-rs --name std_contract
```

- Running the testing harness

```bash
cargo test
```

## Files generated

- The `Cargo.toml` is the manifest for our new test harness and specifies the required dependencies including fuels the Fuel Rust SDK.

- The `tests/harness.rs` contains some boilerplate test code to get us started, though doesn't call any contract methods just yet.
