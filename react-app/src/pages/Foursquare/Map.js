import React, { useState, useEffect } from 'react'
import GoogleMapReact from 'google-map-react'
import { defaultCenter, defaultZoom, mapOptions } from './MapOptions'
import styles from './Foursquare.module.css'

const Marker = ({ $hover, title }) => {
    return (
        <div className={`${styles.marker} ${$hover ? styles.hover : null}`}>
            <span>{title}</span>
        </div>
    )
}

const Map = ({ markers, month }) => {
    const [map, setMap] = useState(null)
    const [maps, setMaps] = useState(null)
    const [options, setOptions] = useState(mapOptions())
    const googleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_KEY

    useEffect(() => {
        if (map && maps && markers && markers.length) {
            const bounds = new maps.LatLngBounds()
            markers.forEach(marker => {
                bounds.extend(new maps.LatLng(marker.lat, marker.lng))
            })
            map.fitBounds(bounds)
        }
    }, [month, markers, map, maps])

    useEffect(() => {
        const changeStyle = () => {
            console.log(mapOptions())
            setOptions(mapOptions())
        }

        window.addEventListener('theme-changed', changeStyle)
        return () => {
            window.removeEventListener('theme-changed', changeStyle)
        }
    }, [])

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: googleMapsKey }}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                options={options}
                hoverDistance={10}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map: gMap, maps: gMaps }) => {
                    if (!map && !maps) {
                        setMap(gMap)
                        setMaps(gMaps)
                    }
                }}>
                {markers &&
                    markers.map(marker => (
                        <Marker key={marker.id} lat={marker.lat} lng={marker.lng} title={marker.title} />
                    ))}
            </GoogleMapReact>
        </div>
    )
}

export default Map
