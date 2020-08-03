import React from "react";
import numeral from "numeral";
import "./Table.scss";

function Table({ countries }) {
  return (
    <div className="table">
      <table>
        <tbody>
          {countries.map(({ country, cases }, index) => (
            <tr key={index}>
              <td>
                {index + 1} {country}
              </td>
              <td>
                <strong>{numeral(cases).format("0,0")}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
