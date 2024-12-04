import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { geoAlbersUsa } from 'd3-geo';
import PulsingDot from './PulsingDot';
import { fetchEngagementData } from '../../services/api'; 
import './styles.css';

const US_MAP_TOPOJSON = 'https://cdn.jsdelivr.net/npm/us-atlas/states-10m.json';
const PASTOR_IMAGE = 'https://cdn.britannica.com/11/172211-050-FCB2ADAF/Pope-Francis-Aparecida-Brazil.jpg'
const HQ_COORDINATES = [-118.2437, 34.0522]; // Example HQ: Los Angeles, CA
const RESULT_LIMIT = 300;

const DynamicImpactMap = () => {
  const [engagementData, setEngagementData] = useState([]);
  const [error, setError] = useState(null);


  const projection = geoAlbersUsa()
    .scale(1000) 
    .translate([400, 300]);


  const createCurvePath = (from, to) => {
    const projectedFrom = projection(from);
    const projectedTo = projection(to); 

    if (!projectedFrom || !projectedTo) {
      console.error('Projection error:', { from, to, projectedFrom, projectedTo });
      return '';
    }

    const [x1, y1] = projectedFrom;
    const [x2, y2] = projectedTo;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 - 200; // Adjust the offset for more or less curvature

    return `M${x1},${y1} Q${midX},${midY} ${x2},${y2}`;
  };


  const fetchData = async () => {
    try {
      const data = await fetchEngagementData(1, RESULT_LIMIT); 
      setEngagementData(data.data); 
      setError(null); 
    } catch (err) {
      console.error('Error fetching engagement data:', err);
      setError('Failed to load engagement data.');
    }
  };

  // Poll for new data every 60 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="dynamic-impact-card">
    {/* Header Section */}
    <div className="map-header">
      <img 
        src={PASTOR_IMAGE}
        alt="Pastor" 
        className="pastor-image" 
      />
      <div>
        <h3>Pope Francis <span className="info-icon">ⓘ</span></h3>
      </div>
    </div>

    {/* Map Section */}
    <div className="map-wrapper">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000, translate: [400, 300] }}
        className="responsive-map"
      >
        <Geographies geography={US_MAP_TOPOJSON}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: '#F0EAD6', stroke: '#D6D6D6', strokeWidth: 0.75 },
                  hover: { fill: '#D8CAB9' },
                  pressed: { fill: '#F4D3C3' },
                }}
              />
            ))
          }
        </Geographies>
        {engagementData.map((event) => (
          <React.Fragment key={event.id}>
            <path
              d={createCurvePath(HQ_COORDINATES, event.coordinates)}
              stroke="#FFA500"
              strokeWidth={1.5}
              fill="none"
              strokeLinecap="round"
            />
            <PulsingDot coordinates={event.coordinates} />
          </React.Fragment>
        ))}
        <Marker coordinates={HQ_COORDINATES}>
          <foreignObject x={-25} y={-25} width={50} height={50}>
            <img
              src={PASTOR_IMAGE}
              alt="HQ Pastor"
              style={{
                borderRadius: '50%',
                width: '60%',
                height: '60%',
                border: '2px solid #FFD700',
              }}
            />
          </foreignObject>
        </Marker>
      </ComposableMap>
    </div>

    {/* Total Reach */}
    <div className="total-reach">
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div>
          <span className="total-reach-label">Total Reach</span>
          <span className="total-reach-number">
            {engagementData.length.toLocaleString()}
          </span>
      </div>
      )}
    </div>
  </div>
  );
};

export default DynamicImpactMap
