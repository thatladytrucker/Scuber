exports.handler = async function (event) {

    try {

        const address = event.queryStringParameters?.address;

        if (!address) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "No address provided"
                })
            };
        }

        const apiKey = process.env.GEOAPIFY_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: "Geoapify API key is not configured"
                })
            };
        }

        const searchAddress =
    /virginia/i.test(address)
        ? address + ", USA"
        : address + ", Virginia, USA";

const url =
    "https://api.geoapify.com/v1/geocode/search" +
    "?text=" + encodeURIComponent(searchAddress) +
    "&filter=countrycode:us" +
    "&apiKey=" + apiKey;

        const response = await fetch(url);

        const data = await response.json();

        return {
            statusCode: response.status,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

    } catch (error) {

        console.error("Geocoding error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Geocoding request failed"
            })
        };
    }
};
