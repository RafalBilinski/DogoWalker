import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

type Position = {
  latitude: number;
  longitude: number;
};

interface RecenterProps {
  position: Position;
}


const Explore = () => {
  const { currentUser, handleProfileUpdate } = useAuth();
  const navigate = useNavigate();
  const defaultPosition: Position = {latitude: 52.237049, longitude: 21.017532}; // Warsaw coordinates
  const [userPosition, setPosition]= useState<Position>(defaultPosition); // Warsaw coordinates
  console.log("last position:", currentUser?.lastPosition?.latitude, currentUser?.lastPosition?.longitude);
  
  const RecenterAutomatically: React.FC<RecenterProps> = ({position}) => {
    const map = useMap();
    useEffect(() => {
      map.setView([position.latitude, position.longitude], map.getZoom());
    }), [position, map];
    return null;
  } 

  useEffect(() => {
    if (!currentUser) navigate("/");
  }, [currentUser, navigate]);

  useEffect(() => {
    updatePosition();
    if (userPosition === defaultPosition) {
      alert("Click on the map to update your position");
    }
  }, []);

  const updatePosition = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition: Position = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          const localizationTreshold = 0.0000001; // Threshold for position update to avoid too frequent updates
          if (Math.abs(newPosition.latitude - userPosition.latitude) > localizationTreshold || 
               Math.abs(newPosition.longitude - userPosition.longitude) > localizationTreshold ) {
            console.log("Updating position:", newPosition);
            setPosition(newPosition);
            handleProfileUpdate({ lastPosition: newPosition })
              .then(() => {
                console.log("Position updated successfully");
              })
              .catch((error) => {
                console.error("Error updating position:", error);
                alert("Failed to update your position. Please try again.");
              });
          }
          
          
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  console.log("userPosition:", userPosition, "currentUser:", );
  return (
    <div className="flex mx-0.5 md:mx-auto w-screen py-5 items-center justify-center h-[calc(100vh-6rem)] bg-gradient-to-br from-primary to-secondary text-white rounded-lg shadow-2xl outline-1 outline-white z-10">
      <div id="map" className="flex w-full h-full p-4 " onClick={updatePosition}>
        <MapContainer
          center={[defaultPosition.latitude, defaultPosition.longitude]}
          zoom={17}
          maxZoom={18}
          minZoom={5}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ height: "100%", width: "100%" }}
          closePopupOnClick={true}
          
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[userPosition.latitude, userPosition.longitude]}>
            <Popup>Your location here!</Popup>
          </Marker>
          <RecenterAutomatically position={userPosition}  />
        </MapContainer>
      </div>
    </div>
  );
};

export default Explore;
