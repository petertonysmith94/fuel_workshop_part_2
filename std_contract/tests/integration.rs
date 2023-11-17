use fuels::{prelude::*, types::ContractId};

// Load abi from json
abigen!(Contract(
    name = "CounterContract",
    abi = "out/debug/counter-contract-abi.json"
));

async fn get_contract_instance() -> (CounterContract<WalletUnlocked>, ContractId) {
    // Launch a local network and deploy the contract
    let mut wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(1),             /* Single wallet */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await;
    let wallet = wallets.pop().unwrap();

    let id = Contract::load_from(
        "./out/debug/counter-contract.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxParameters::default())
    .await
    .unwrap();

    let instance = CounterContract::new(id.clone(), wallet);

    (instance, id.into())
}

#[tokio::test]
async fn test_should_increment_counter_by_one() {
  let (instance, _id) = get_contract_instance().await;

  instance.methods().increment().call().await.unwrap();

  let result = instance.methods().count().call().await.unwrap();
  assert_eq!(result.value, 1);
}


#[tokio::test]
async fn test_should_increment_counter_more_than_once() {
  let (instance, _id) = get_contract_instance().await;

  instance.methods().increment().call().await.unwrap();
  instance.methods().increment().call().await.unwrap();

  let result = instance.methods().count().call().await.unwrap();
  assert_eq!(result.value, 2);
}