import React, {useContext, useEffect} from 'react'
import ReactMapGL, {Marker, Popup, NavigationControl} from 'react-map-gl'
import Spinner from '../layout/Spinner'
import TransactionContext from '../../context/transaction/transactionContext'
import MarkerIcon from '../layout/marker-15.svg';

const TransactionMap = () => {
  const transactionContext = useContext(TransactionContext);

  const {filtered, transactions, location, setLocation, setViewport, viewport, loading, transactionsByMonth, month} = transactionContext;

  const size = 20;

  if (window.screen.width <= 900) {
    viewport.height = "65vh";
  }

  useEffect(() => {
    const listener = (e) => {
      if(e.key === "Escape") {
        setLocation(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    }
  }, []);

  const formatDate = (input) => {
    const date = new Date(input);
    return date.toLocaleString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' });
  }

  return (
    <div id="transactions_map">
      {month !== null && !loading ? (
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={viewport => {
          setViewport(viewport);
        }}
      >
        <NavigationControl style={{left: 10, top: 10}} />
        {filtered !== null ? filtered.map(location => (
          <Marker 
            key={location.transactionId}
            latitude={location.latitude}
            longitude={location.longitude}
          >
            <img className="marker-img" style={{transform: `translate(${-size / 2}px,${-size}px)`}} src={MarkerIcon} alt="Marker" onClick={() => {
              setLocation(location);
            }}/>
          </Marker>
          )) : transactionsByMonth.map((location) => (
          <Marker 
            key={location.transactionId}
            latitude={location.latitude}
            longitude={location.longitude}
          >
            <img className="marker-img" style={{transform: `translate(${-size / 2}px,${-size}px)`}} src={MarkerIcon} alt="Marker" onClick={() => {
              setLocation(location);
            }}/>
          </Marker>
          ))
        }

        {/* Manage Popups */}
        {location && (
          <Popup
            latitude={location.latitude}
            longitude={location.longitude}
            onClose={() => {
              setLocation(null);
            }}
          >
            <div style={{color: "black"}}>
              <h4>
                <strong>{location.merchantName}</strong>
              </h4>
              <ul>
                <li>
                  <span className="text-success">{"$" + location.transactionAmount}</span>
                </li>
                <li>
                  <i className="fas fa-user-circle"/> {location.memberName + " | " }
                  <em className="text-light">{formatDate(location.transactionDate)}</em>
                </li>
                <li>{location.categoryName}</li>
              </ul>
            </div>
          </Popup>
        )}
      </ReactMapGL>
      ) : <Spinner />}
    </div>
  )
}

export default TransactionMap