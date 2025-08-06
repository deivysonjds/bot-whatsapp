import config from "./config.js";

export default async function postAmountMessages(amount) {

    let response = await fetch(`${config.API_URL}/messages_sent`, {
        method: 'POST',
        headers: {
            'X-Parse-Application-Id': config.PARSE_APPLICATION_ID,
            'X-Parse-REST-API-Key': config.PARSE_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'amountMessages': amount
        })
    })

    if (!response.ok) {
        throw new Error(`Error fetching config data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}
