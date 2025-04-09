// This script will add markers to the Google Map
        document.addEventListener('DOMContentLoaded', function() {
            // Create a script element to load Google Maps API
            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            
            // Define the initMap function that will be called when API loads
            window.initMap = function() {
                // Define locations
                const locations = [
                    { 
                        title: 'Los Angeles - White Memorial', 
                        lat: 34.0593676, 
                        lng: -118.2082451,
                        address: '1700 E. Cesar E. Chavez Ave., Suite 3400, Los Angeles, CA 90033'
                    },
                    { 
                        title: 'Pasadena', 
                        lat: 34.1478789, 
                        lng: -118.1308623,
                        address: '567 Lake Avenue, Suite 200, Pasadena, CA 91101'
                    },
                    { 
                        title: 'Newport Beach', 
                        lat: 33.620479, 
                        lng: -117.9259686,
                        address: '4321 Pacific Coast Highway, Newport Beach, CA 92660'
                    },
                    { 
                        title: 'Montebello', 
                        lat: 34.019431, 
                        lng: -118.1310489,
                        address: '1234 Montebello Boulevard, Montebello, CA 90640'
                    },
                    { 
                        title: 'Whittier', 
                        lat: 33.9648531, 
                        lng: -118.0471009,
                        address: '8765 Whittier Boulevard, Whittier, CA 90605'
                    },
                    { 
                        title: 'Glendale', 
                        lat: 34.1464799, 
                        lng: -118.2548863,
                        address: '789 Brand Boulevard, Suite 300, Glendale, CA 91203'
                    }
                ];

                // Get the map container
                const mapContainer = document.querySelector('.map-container');
                
                // Clear any existing content
                mapContainer.innerHTML = '';
                
                // Create a div for the map
                const mapDiv = document.createElement('div');
                mapDiv.id = 'locations-map';
                mapDiv.style.width = '100%';
                mapDiv.style.height = '450px';
                mapContainer.appendChild(mapDiv);
                
                // Create the map centered on Los Angeles
                const map = new google.maps.Map(mapDiv, {
                    center: { lat: 34.0522, lng: -118.2437 },
                    zoom: 9
                });
                
                // Define bounds to fit all markers
                const bounds = new google.maps.LatLngBounds();
                
                // Create info window for markers
                const infoWindow = new google.maps.InfoWindow();
                
                // Create markers for each location
                locations.forEach(location => {
                    const marker = new google.maps.Marker({
                        position: { lat: location.lat, lng: location.lng },
                        map: map,
                        title: location.title,
                        animation: google.maps.Animation.DROP,
                        icon: {
                            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                        }
                    });
                    
                    // Add click event to show info window
                    marker.addListener('click', () => {
                        infoWindow.setContent(`
                            <div style="padding: 10px; max-width: 250px;">
                                <h3 style="margin-top: 0;">${location.title}</h3>
                                <p>${location.address}</p>
                                <p><strong>Phone:</strong> (800) 555-2020</p>
                                <p><strong>Hours:</strong><br>Mon-Fri: 8am-6pm<br>Sat: 9am-2pm • Sun: Closed</p>
                                <a href="https://maps.google.com/?q=${location.address}" target="_blank" style="display: inline-block; padding: 5px 10px; background-color: #76b900; color: white; text-decoration: none; border-radius: 4px; margin-top: 5px;">Get Directions</a>
                            </div>
                        `);
                        infoWindow.open(map, marker);
                    });
                    
                    // Extend bounds to include this marker
                    bounds.extend({ lat: location.lat, lng: location.lng });
                });
                
                // Fit map to bounds of all markers
                map.fitBounds(bounds);
                
                // Set minimum zoom level
                google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
                    if (map.getZoom() > 10) {
                        map.setZoom(10);
                    }
                });
            };
        });
