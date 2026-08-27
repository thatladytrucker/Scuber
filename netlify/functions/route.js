exports.handler = async function (event) {

    try {

        const pickupLat =
            event.queryStringParameters.pickupLat;

        const pickupLon =
            event.queryStringParameters.pickupLon;

        const destinationLat =
            event.queryStringParameters.destinationLat;

        const destinationLon =
            event.queryStringParameters.destinationLon;


        if (
            !pickupLat ||
            !pickupLon ||
            !destinationLat ||
            !destinationLon
        ) {

            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Missing route coordinates."
                })
            };

        }


        const waypoints =
            `${pickupLat},${pickupLon}|${destinationLat},${destinationLon}`;


        const url =
            "https://api.geoapify.com/v1/routing?" +
            "waypoints=" +
            encodeURIComponent(waypoints) +
            "&mode=drive" +
            "&apiKey=" +
            process.env.GEOAPIFY_API_KEY;


        const response =
            await fetch(url);


        if (!response.ok) {

    const errorData =
        await response.text();

    console.error(
        "Geoapify routing error:",
        errorData
    );

    return {
        statusCode: response.status,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            error: "Geoapify routing request failed.",
            geoapifyResponse: errorData
        })
    };

}


        const data =
            await response.json();


        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };


    } catch (error) {

        console.error(
            "Route function error:",
            error
        );


        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Unable to calculate route."
            })
        };

    }

};

