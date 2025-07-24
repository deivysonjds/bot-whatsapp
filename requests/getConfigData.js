
export default async function getConfigData() {

    let response = await fetch(process.env.URL, {
        method: 'GET',
        headers: {
            'X-Parse-Application-Id': process.env.PARSEAPLICATIONID,
            'X-Parse-REST-API-Key': process.env.PARSEAPIKEY,
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`Error fetching config data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results[0];
}
