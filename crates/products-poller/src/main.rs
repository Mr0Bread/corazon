use reqwest;
use tokio;
use serde;
use serde_json;
use dotenv::dotenv;
use std;

#[derive(thiserror::Error, Debug)]
enum Error {
    #[error("Request failed")]
    RequestFailed
}

#[derive(serde::Deserialize, Debug)]
struct Message {
    key: String,
    value: String,
    topic: String,
    partition: i32,
    offset: i64,
    timestamp: i64,
}

#[derive(serde::Deserialize, serde::Serialize, Debug)]
struct MessageValue {
    productId: String
}

async fn consume_messages() -> Result<Vec<Message>, Error> {
    println!("Consuming messages...");
    let token = match std::env::var("CONSUME_API_TOKEN") {
        Ok(val) => val,
        Err(_) => return Err(Error::RequestFailed),
    };
    let client = reqwest::Client::new();
    let response = client
        .get(
            "https://settled-pipefish-14875-eu1-rest-kafka.upstash.io/consume/group_1/instance_1/new-products"
        )
        .header("Authorization", "Basic ".to_owned() + &token)
        .header("Kafka-Auto-Offset-Reset", "earliest")
        .send()
        .await;

    let json = match response {
        Ok(response) => response.json::<Vec<Message>>().await,
        Err(error) => Err(error),
    };

    if json.is_err() {
        println!("Error: {:?}", json.err().unwrap());
        return Err(Error::RequestFailed);
    }

    let json = json.unwrap();

    return Ok(json);
}

async fn trigger_product_processing(
    message: Message,
    client: &reqwest::Client,
) {
    let api_url = match std::env::var("GENERATE_PRODUCT_API_URL") {
        Ok(val) => val,
        Err(_) => return,
    };
    let api_token = match std::env::var("API_TOKEN") {
        Ok(val) => val,
        Err(_) => return,
    };
    let product: MessageValue = serde_json::from_str(&message.value).unwrap();

    let response = client
        .post(&api_url)
        .json(&product)
        .bearer_auth(api_token)
        .send()
        .await;

    match response {
        Ok(response) => {
            println!("Response: {:?}", response);
        },
        Err(error) => {
            println!("Error: {:?}", error);
        },
    }
}

async fn process() -> Result<(), Error> {
    println!("Processing...");
    let result = consume_messages().await;

    let messages = match result {
        Ok(messages) => messages,
        Err(error) => return Err(error),
    };

    let client = reqwest::Client::new();

    messages
        .into_iter()
        .for_each(|message| {
            let client = client.clone();

            tokio::spawn(
                async move {
                    trigger_product_processing(
                        message,
                        &client,
                    ).await;
                }
            );
        });

    Ok(())
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    println!("Started products poller");

    loop {
        process().await;
        tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
    }
}
