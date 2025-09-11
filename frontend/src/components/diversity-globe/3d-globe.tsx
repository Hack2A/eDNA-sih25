import React from "react";
import Globe from "react-globe.gl";

export default function EarthGlobe() {
    const markers = [
        { lat: 28.6139, lng: 77.2090, name: "Delhi" },
        { lat: 40.7128, lng: -74.0060, name: "New York" },
        { lat: 48.8566, lng: 2.3522, name: "Paris" },
        { lat: -33.8688, lng: 151.2093, name: "Sydney" }
    ];

    return (
        <Globe
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)"
            labelsData={markers}
            labelLat={(d) => d.lat}
            labelLng={(d) => d.lng}
            labelText={(d) => d.name}
            labelSize={2.2}
            labelDotRadius={0.4}
            labelColor={() => "red"}
            onLabelClick={(marker) => alert(`Clicked on ${marker.name}`)}
        />
    );
}
