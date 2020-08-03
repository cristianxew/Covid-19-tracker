import React, { useState, useEffect } from "react";

import numeral from "numeral";
import {
  FormControl,
  MenuItem,
  Select,
  CardContent,
  Card,
} from "@material-ui/core";

import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import { sortData, prettyPrintStat } from "./utils/utils";
import "./App.scss";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url1 = "https://disease.sh/v3/covid-19/all";
    const url2 = `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    if (countryCode === "worldwide") {
      await fetch(url1)
        .then((res) => res.json())
        .then((data) => {
          setCountryInfo(data);
          setMapCenter({ lat: 34.80746, lng: -40.4796 });
          setMapZoom(2);
        });
    } else {
      await fetch(url2)
        .then((res) => res.json())
        .then((data) => {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setCountryInfo(data);
          setMapZoom(4);
        });
    }
  };

  return (
    <React.Fragment>
      <div className="header">
        <h1>Covid 19 tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange}>
            <MenuItem value="worldwide">WorlWide</MenuItem>
            {countries.map((country, index) => (
              <MenuItem key={index} value={country.value}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="app">
        <div className="app__left">
          <div className="app-stats-container">
            {countryInfo.country ? (
              <div className="country-name">
                <span>{countryInfo.country}</span>
                <img
                  className="country-flag"
                  alt={`${countryInfo.country}'s flag`}
                  src={countryInfo.countryInfo.flag}
                />
              </div>
            ) : (
              <div className="country-name">
                <h5>Worldwide</h5>
              </div>
            )}
            <div className="app__stats">
              <InfoBox
                isRed={true}
                active={casesType === "cases"}
                onClick={(e) => setCasesType("cases")}
                cases={prettyPrintStat(countryInfo.todayCases)}
                total={numeral(countryInfo.cases).format("0,0")}
                title="Cases"
              ></InfoBox>
              <InfoBox
                active={casesType === "recovered"}
                onClick={(e) => setCasesType("recovered")}
                cases={prettyPrintStat(countryInfo.todayRecovered)}
                total={numeral(countryInfo.recovered).format("0,0")}
                title="Recovered"
              ></InfoBox>
              <InfoBox
                isRed={true}
                active={casesType === "deaths"}
                onClick={(e) => setCasesType("deaths")}
                cases={prettyPrintStat(countryInfo.todayDeaths)}
                total={numeral(countryInfo.deaths).format("0,0")}
                title="Deaths"
              ></InfoBox>
            </div>
          </div>
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          ></Map>
        </div>
        <Card className="app__right">
          <CardContent className="app__right__content">
            <div className="table-container">
              <h3 className="app__tableTitle">Live Cases by country</h3>
              <Table countries={tableData}></Table>
            </div>
            <div className="graph-container">
              <h3 className="app__graphTitle">Worldwide new {casesType} </h3>
              <LineGraph className="app__graph" casesType={casesType} />
            </div>
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  );
}

export default App;
