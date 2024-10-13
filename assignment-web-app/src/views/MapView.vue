<template>
    <div class="container mt-3">
        <h2>Interactive Map</h2>
        <div class="row mb-3">
            <input
                type="text"
                class="form-control"
                placeholder="Search for a place"
                v-model="searchQuery"
                @keyup.enter="handleSearch"
            />
            <button class="btn btn-primary mt-2" @click="handleSearch" :disabled="searchLoading">{{ searchLoading ? 'Searching...' : 'Search' }}</button>
            
            <ul v-if="searchResults.length" class="list-group mt-2">
                <li v-for="(result, index) in searchResults" :key="index"
                class="list-group-item list-group-item-action"
                @click="selectLocation(result)"
                >
                {{ result.place_name }}
                </li>
            </ul>
            <div class="mt-3" v-if="route">
                <h4>Route Details</h4>
                <p><strong>Distance:</strong> {{ route.distance.toFixed(2) }} m</p>
                <p><strong>Duration:</strong> {{ (route.duration / 60).toFixed(2) }} mins</p>
            </div>
        </div>

        <div id="map" style="width: 100%; height: 500px;"></div>
    </div>
</template>
  
<script>
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import markerIcon from '@/assets/icons/location-pin.png';

export default {
    name: 'MapView',
    data() {
        return {
        map: null,
        searchQuery: '',
        searchResults: [],
        searchLoading: false,
        markers: [],
        route: null,
        userLocation: null,
        startPoint: null,
        endPoint: null,
        markerElement: null,
        };
    },
    methods: {
        createCustomMarker() {
            const marker = document.createElement('div');
            marker.className = 'custom-marker';
            const img = document.createElement('img');
            img.src = markerIcon;
            img.alt = 'Marker Icon';
            img.style.width = '30px';
            img.style.height = '30px';
            marker.appendChild(img);
            return marker;
        },
        
        async initialiseMap() {
            mapboxgl.accessToken = 'pk.eyJ1IjoiYXJpZWx6aG91IiwiYSI6ImNtMjc5dDkxeDBqY3AyaXEzbHU0dmVwbTkifQ.xKnExyFUNvtOqO_HIC0ceQ';

            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [0, 0], // Default center
                zoom: 2,
            });

            this.map.addControl(new mapboxgl.NavigationControl());

            this.map.on('click', (e) => {
                const coordinates = [e.lngLat.lng, e.lngLat.lat];
                this.addMarker(coordinates);
            });

            // Geolocate the user
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = [position.coords.longitude, position.coords.latitude];
                    this.map.setCenter(this.userLocation);
                    this.addMarker(this.userLocation);
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                }
                );
            }
        },

        addMarker(coordinates) {
            const markerElement = this.createCustomMarker();
            // Remove existing markers
            this.markers.forEach((marker) => marker.remove());
            this.markers = [];

            // Add new marker
            const marker = new mapboxgl.Marker({element: markerElement, anchor: 'bottom'})
                .setLngLat(coordinates)
                .setPopup(new mapboxgl.Popup().setText('Selected Location'))
                .addTo(this.map);

            this.markers.push(marker);

            // Set start and end points
            if (!this.startPoint) {
                this.startPoint = coordinates;
                marker.getPopup().setText('Start Point');
            } else if (!this.endPoint) {
                this.endPoint = coordinates;
                marker.getPopup().setText('End Point');
                this.getRoute();
            } else {
                // Reset points if both are already set
                this.startPoint = coordinates;
                this.endPoint = null;
                this.route = null;
            }

            // Center the map on the selected coordinates
            this.map.flyTo({
                center: coordinates,
                zoom: 12, 
                essential: true
            });
        },

        // Search map
        async handleSearch() {
            if (!this.searchQuery.trim()) return;
            this.searchLoading = true;
            this.searchResults = [];

            try {
                const cloudFunctionURL = 'https://us-central1-azho0003-5032.cloudfunctions.net/mapboxSearch';
                const response = await axios.get(cloudFunctionURL, {
                params: { query: this.searchQuery },
                });

                this.searchResults = response.data.results;
            } catch (error) {
                console.error('Search error:', error.response ? error.response.data : error.message);
                alert('Failed to search places. Please try again.');
            } finally {
                this.searchLoading = false;
            }
        },

        selectLocation(result) {
            this.searchQuery = result.place_name;
            this.searchResults = [];

            if (!this.startPoint) {
                this.startPoint = result.coordinates;
                this.addMarker(result.coordinates);
            } else if (!this.endPoint) {
                this.endPoint = result.coordinates;
                this.addMarker(result.coordinates);
            } else {
                // Reset points if both are already set
                this.startPoint = result.coordinates;
                this.endPoint = null;
                this.route = null;
                this.addMarker(result.coordinates);
        }
        },

        // Get route between two points on map
        async getRoute() {
        if (!this.startPoint || !this.endPoint) return;

        try {
            const cloudFunctionURL = 'https://us-central1-azho0003-5032.cloudfunctions.net/mapboxDirections';
            const response = await axios.get(cloudFunctionURL, {
            params: {
                start: `${this.startPoint[0]},${this.startPoint[1]}`,
                end: `${this.endPoint[0]},${this.endPoint[1]}`,
            },
            });

            if (response.data.routes && response.data.routes.length) {
            this.route = response.data.routes[0];
            const geojson = {
                type: 'Feature',
                geometry: this.route.geometry,
            };

            // Remove existing route
            if (this.map.getLayer('route')) {
                this.map.removeLayer('route');
                this.map.removeSource('route');
            }

            // Add route to the map
            this.map.addSource('route', {
                type: 'geojson',
                data: geojson,
            });

            this.map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                'line-join': 'round',
                'line-cap': 'round',
                },
                paint: {
                'line-color': '#0000FF',
                'line-width': 6,
                },
            });

            // Fit map bounds to the route
            const bounds = new mapboxgl.LngLatBounds();
            this.route.geometry.coordinates.forEach((coord) => bounds.extend(coord));
            this.map.fitBounds(bounds, { padding: 50 });
            }
        } catch (error) {
            console.error('Directions error:', error.response ? error.response.data : error.message);
            alert('Failed to get route. Please try again.');
        }
        },
    },
    mounted() {
        this.initialiseMap();
    },
    beforeUnmount() {
        if (this.map) {
        this.map.remove();
        }
    },
};
</script>
  
<style scoped>
    #map {
        width: 100%;
        height: 500px;
    }

    .custom-marker {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .custom-marker img {
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }
</style>