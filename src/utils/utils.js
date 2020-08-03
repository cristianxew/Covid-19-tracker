import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#cc1034",
    multiplier: 400,
  },
  recovered: {
    hex: "#008000",
    multiplier: 400,
  },
  deaths: {
    hex: "#000000",
    multiplier: 400,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

//Draw circles on the map
export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country, index) => (
    <Circle
      key={index}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      stroke={false}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <img
            src={country.countryInfo.flag}
            className="info-flag"
            alt={`${country.country}'s flag`}
          ></img>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0,0")}` : "+0";
