import config from "./config.js";

export default async function putConfigData(configdata) {
    console.log(configdata);
    
    let response = await fetch(`${config.API_URL}/configBotWhatsapp/oCFiF3WL52`, {
        method: 'PUT',
        headers: {
            'X-Parse-Application-Id': config.PARSE_APPLICATION_ID,
            'X-Parse-REST-API-Key': config.PARSE_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(configdata)
    })
    
    if (!response.ok) {
        throw new Error(`Error fetching config data: ${await response.text()}`);
    }
    const data = await response.json();
    return data;
}
