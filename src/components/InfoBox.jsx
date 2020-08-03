import React from "react";
import "./InfoBox.scss";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, cases, total, active, isRed, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "--selected"} ${isRed && "--red"}`}
    >
      <CardContent>
        <Typography className="infoBox__title">{title}</Typography>

        <Typography className="infoBox__total">Total: {total}</Typography>
        <h4 className={`infoBox__cases ${!isRed && "--green"}`}>{cases}</h4>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
