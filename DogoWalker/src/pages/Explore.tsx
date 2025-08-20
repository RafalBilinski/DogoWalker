import { useEffect, useState } from "react";
import { useAuth } from "../services/AuthFeatures/AuthContext";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import showToast from "../utils/showToast";
import { GeoPoint } from "firebase/firestore";

interface RecenterProps {
  position: GeoPoint;
}

const Explore = () => {
  const { currentUser, handleProfileUpdate } = useAuth();
  const navigate = useNavigate();
  const defaultPosition = new GeoPoint(52.237049, 21.017532); // Warsaw coordinates
  const [userPosition, setPosition] = useState<GeoPoint>(
    currentUser?.lastPosition || defaultPosition
  ); // Warsaw coordinates

  const RecenterAutomatically: React.FC<RecenterProps> = ({ position }) => {
    const map = useMap();
    (useEffect(() => {
      map.setView([position.latitude, position.longitude], map.getZoom());
    }),
      [position, map]);
    return null;
  };

  useEffect(() => {
    if (!currentUser) navigate("/");
  }, [currentUser]);

  const updatePosition = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const newPosition = new GeoPoint(position.coords.latitude, position.coords.longitude);
          const localizationTreshold = 0.0001; // Threshold for position update to avoid too frequent updates

          if (
            Math.abs(newPosition.latitude - userPosition.latitude) > localizationTreshold ||
            Math.abs(newPosition.longitude - userPosition.longitude) > localizationTreshold
          ) {
            setPosition(newPosition);
            handleProfileUpdate({ lastPosition: newPosition })
              .then(() => {
                console.log("Position updated successfully");
                showToast("Position updated", "info");
              })

              .catch(error => {
                console.error("Error updating position:", error);
                showToast("Failed to update your position. Please try again.", "error");
              });
          }
        },
        error => {
          console.error("Error getting location:", error);
          showToast("Unable to retrieve your location. Please allow location access.", "error");
        },
        {
          enableHighAccuracy: true,
          timeout: 60000,
          maximumAge: 60000,
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    updatePosition();

    if (userPosition === defaultPosition) {
      alert("Unable to retrieve your location. Please allow location access.");
    }
  }, []);

  console.log("Explore render. userPosition:", userPosition);
  return (
    <div
      className="flex sm:w-full mx-auto max-w-screen p-5 items-center justify-center min-h-[calc(100vh-7rem)] 
    bg-gradient-to-br from-transparent to-primary text-white rounded-lg shadow-2xl z-10"
    >
      <div id="map" className="flex h-full sm:w-full " onClick={updatePosition}>
        <MapContainer
          center={
            userPosition === defaultPosition
              ? [defaultPosition.latitude, defaultPosition.longitude]
              : [userPosition.latitude, userPosition.longitude]
          }
          zoom={17}
          maxZoom={18}
          minZoom={5}
          scrollWheelZoom={true}
          className="w-full h-full min-w-[300px] min-h-[300px]"
          closePopupOnClick={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[userPosition.latitude, userPosition.longitude]}>
            <Popup>Your location here!</Popup>
          </Marker>
          <RecenterAutomatically position={userPosition} />
        </MapContainer>
      </div>
    </div>
  );
};

export default Explore;
