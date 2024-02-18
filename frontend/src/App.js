import { Component } from "react";
import Loader from "react-loader-spinner";

import Transactions from "./components/Transactions";
import Statistics from "./components/Statistics";
import BarChartTask from "./components/BarChart";
import PieChartTask from "./components/PieChart";
import "./App.css";

const apiStatusConstants = {
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
  initial: "INITIAL",
};

const months = [
  { value: "", displayText: "Select Month" },
  { value: "01", displayText: "January" },
  { value: "02", displayText: "February" },
  { value: "03", displayText: "March" },
  { value: "04", displayText: "April" },
  { value: "05", displayText: "May" },
  { value: "06", displayText: "June" },
  { value: "07", displayText: "July" },
  { value: "08", displayText: "August" },
  { value: "09", displayText: "September" },
  { value: "10", displayText: "October" },
  { value: "11", displayText: "November" },
  { value: "12", displayText: "December" },
];

class App extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    selectedMonth: months[0].value,
    searchText: "",
    limit: 10,
    page: 1,
    productsData: {},
  };

  componentDidMount() {
    this.getProductTransactions();
  }
  getProductTransactions = async () => {
    const { selectedMonth, searchText, limit, page } = this.state;
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    });
    const offset = (page - 1) * limit;
    const apiUrl = `https://roxiler-systems-assignment.onrender.com/combined-response?month=${selectedMonth}&s_query=${searchText}&limit=${limit}&offset=${offset}`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      this.setState({
        apiStatus: apiStatusConstants.success,
        productsData: data,
        searchText: "",
      });
    } else {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#000000" height="50" width="50" />
    </div>
  );

  changeSearchInput = (event) => {
    this.setState({ searchText: event.target.value });
  };

  onKeyDownSearch = async (event) => {
    if (event.key === "Enter") {
      this.setState({ page: 1 }, this.getProductTransactions);
    }
  };

  changeMonth = (event) => {
    this.setState(
      { selectedMonth: event.target.value },
      this.getProductTransactions
    );
  };

  incrementPage = () => {
    this.setState(
      (prevState) => ({ page: prevState.page + 1 }),
      this.getProductTransactions
    );
  };

  decrementPage = () => {
    this.setState(
      (prevState) => ({ page: prevState.page - 1 }),
      this.getProductTransactions
    );
  };

  renderTransactions = (productsData, page, searchText, selectedMonth) => (
    <div className="transaction-container">
      <div className="header-container">
        <h1 className="header-text">
          Transaction
          <br />
          Dashboard
        </h1>
      </div>
      <div className="filter-container">
        <input
          type="search"
          placeholder="Search transaction"
          value={searchText}
          onKeyDown={this.onKeyDownSearch}
          onChange={this.changeSearchInput}
          className="input-search"
        />
        <select
          value={selectedMonth}
          onChange={this.changeMonth}
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
      <Transactions
        listTransactions={productsData.listTransactions}
        page={page}
        increment={this.incrementPage}
        decrement={this.decrementPage}
      />
      ;
    </div>
  );

  renderStatistics = (selectedMonth, statisticsData) => (
    <Statistics
      statisticsDetails={statisticsData}
      selectMonth={selectedMonth}
      months={months}
      changeMonth={this.changeMonth}
    />
  );

  renderBarChart = (selectedMonth, barChartData) => (
    <BarChartTask
      barChartData={barChartData}
      selectMonth={selectedMonth}
      months={months}
      changeMonth={this.changeMonth}
    />
  );

  renderPieChart = (selectedMonth, pieChartData) => (
    <PieChartTask
      pieChartData={pieChartData}
      selectMonth={selectedMonth}
      months={months}
      changeMonth={this.changeMonth}
    />
  );

  renderProductsData = () => {
    const { productsData, page, searchText, selectedMonth } = this.state;
    return (
      <>
        {this.renderTransactions(productsData, page, searchText, selectedMonth)}
        {this.renderStatistics(selectedMonth, productsData.statistics)}
        {this.renderBarChart(selectedMonth, productsData.barChart)}
        {this.renderPieChart(selectedMonth, productsData.pieChart)}
      </>
    );
  };

  renderFailureView = () => (
    <div className="failure-container">
      <h1 className="failure-text">Failed To Fetch The Data</h1>
      <button
        className="failure-button"
        type="button"
        onClick={this.getProductTransactionData}
      >
        Retry
      </button>
    </div>
  );

  renderProducts = (apiStatus) => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsData();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoader();
      default:
        return null;
    }
  };

  render() {
    const { apiStatus, productsData } = this.state;
    console.log(productsData);
    return (
      <div className="project-container">{this.renderProducts(apiStatus)}</div>
    );
  }
}

export default App;
