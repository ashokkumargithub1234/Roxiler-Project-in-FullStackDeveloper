import "./index.css";

const Statistics = (props) => {
  const { statisticsDetails, selectMonth, months, changeMonth } = props;
  const { totalSaleAmount, soldItems, notSoldItems } = statisticsDetails;
  const changeMonthText = (event) => {
    changeMonth(event);
  };
  return (
    <div className="statistics-container">
      <div className="statistics-header-container">
        <h1 className="statistics-header">Statistics - </h1>
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
      <table>
        <tbody>
          <tr>
            <td>Total sale</td>
            <td>{Math.round(totalSaleAmount.total * 100) / 100}</td>
          </tr>
          <tr>
            <td>Total sold item</td>
            <td>{soldItems.count}</td>
          </tr>
          <tr>
            <td>Total not sold item</td>
            <td>{notSoldItems.count}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
