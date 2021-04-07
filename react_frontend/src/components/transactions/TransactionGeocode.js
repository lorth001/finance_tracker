import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import React, {useState, useRef, useCallback, useContext, useEffect} from 'react'
import ReactMapGL from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'
import TransactionContext from '../../context/transaction/transactionContext'

const TransactionGeocode = () => {

  const transactionContext = useContext(TransactionContext);

  const {setGeocode, current} = transactionContext;

  let currentGeocode;

  {current !== null ? currentGeocode = {
    latitude: current.latitude,
    longitude: current.longitude
  } : currentGeocode = null}

  useEffect(() => {
    if(current !== null) {
      setGeocode(currentGeocode);
      setViewport(currentGeocode);
    } else {
      setGeocode(null);
    }
  }, []);

  const newGeocode = (viewport) => {
    const address = document.getElementsByClassName('mapboxgl-ctrl-geocoder--input')[0].value;
    viewport.address = address;
    setGeocode(viewport);
  }

  const [viewport, setViewport] = useState({
    latitude: (current !== null ? current.latitude : 39.8283),
    longitude: (current !== null ? current.longitude : -98.5795),
    zoom: (current !== null ? 10 : 2)
  })
  
  const geocoderContainerRef = useRef();
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );
  
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };
      newGeocode(newViewport);
      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      });
    },
    [handleViewportChange]
  );

  return (
    <div className="geocode">
      <div
        ref={geocoderContainerRef}
        style={{ position: "absolute", zIndex: 1, paddingTop: 20, paddingLeft: 20 }}
      />
      <ReactMapGL
        ref={mapRef}
        {...viewport}
        height="100%"
        width="100%"
        onViewportChange={handleViewportChange}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      >
        <Geocoder
          mapRef={mapRef}
          containerRef={geocoderContainerRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          position="top-left"
          paddingTop="50px"
        >
        </Geocoder>
      </ReactMapGL>
    </div>
  )
}

export default TransactionGeocode