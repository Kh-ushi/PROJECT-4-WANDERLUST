
        /* eslint-disable camelcase */
        const map = new maplibregl.Map({
            container: 'map',
            // Use a minimalist raster style
            style: {
                'version': 8,
                'name': 'Blank',
                'center': [0, 0],
                'zoom': 0,
                'sources': {
                    'raster-tiles': {
                        'type': 'raster',
                        'tiles': ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        'tileSize': 256,
                        'minzoom': 0,
                        'maxzoom': 19
                    }
                },
                'layers': [
                    {
                        'id': 'background',
                        'type': 'background',
                        'paint': {
                            'background-color': '#e0dfdf'
                        }
                    },
                    {
                        'id': 'simple-tiles',
                        'type': 'raster',
                        'source': 'raster-tiles'
                    }
                ],
                'id': 'blank'
            },
            center: [0, 0], // Default center
            zoom: 2, // Default zoom
            pitch: 40,
            bearing: 20,
            antialias: true
        });

        const geocoderApi = {
            forwardGeocode: async (config) => {
                const location = config.query;

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json&addressdetails=1&limit=1`);
                    const data = await response.json();
                    if (data.length > 0) {
                        const result = data[0];
                        return {
                            features: [
                                {
                                    type: 'Feature',
                                    geometry: {
                                        type: 'Point',
                                        coordinates: [parseFloat(result.lon), parseFloat(result.lat)]
                                    },
                                    place_name: result.display_name,
                                    properties: result,
                                    text: result.display_name,
                                    place_type: ['place'],
                                    center: [parseFloat(result.lon), parseFloat(result.lat)]
                                }
                            ]
                        };
                    } else {
                        console.error(`No results found for location: ${location}`);
                        return { features: [] };
                    }
                } catch (error) {
                    console.error(`Error while geocoding location: ${error}`);
                    return { features: [] };
                }
            }
        };

        // Function to add a marker to the map based on the backend location
        async function addMarker(location) {
            const geocodeResult = await geocoderApi.forwardGeocode({ query: location.name });
            const coordinates = geocodeResult.features.length > 0 ? geocodeResult.features[0].geometry.coordinates : null;
            if (coordinates) {
                new maplibregl.Marker()
                    .setLngLat(coordinates)
                    .setPopup(new maplibregl.Popup().setHTML(`<h3>${location.name}</h3>`))
                    .addTo(map);
                // Center the map on the marker's location
                map.setCenter(coordinates);
                map.setZoom(10); // Adjust the zoom level as needed
            } else {
                console.error(`Unable to derive coordinates for location: ${location.name}`);
            }
        }

        // Example backend data
        const backendLocation = { name: locationInp};

        // Add marker to the map based on the backend location
        addMarker(backendLocation);
   
