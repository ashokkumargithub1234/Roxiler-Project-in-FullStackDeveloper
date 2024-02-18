import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

import "./index.css";

const BarChartTask = (props) => {
  const { barChartData, selectMonth, months, changeMonth } = props;
  const changeMonthText = (event) => {
    changeMonth(event);
  };

  return (
    <div className="barChart-container">
      <div className="barChart-header-container">
        <h1 className="barChart-header">Bar Chart Stats - </h1>
        <select
          value={selectMonth}
          onChange={changeMonthText}
          className="select-month"
        >
          {months.map((eachMonth) => (
            <option
              key={eachMonth.value}
              value={eachMonth.value}
              className="checked-text"
            >
              {eachMonth.displayText}
            </option>
          ))}
        </select>
      </div>
      <BarChart
        width={900}
        height={400}
        data={barChartData.barChartData}
        margin={{
          top: 5,
        }}
      >
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#6ce5e8" />
      </BarChart>
    </div>
  );
};

export default BarChartTask;
