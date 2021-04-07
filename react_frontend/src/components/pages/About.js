import React, {useEffect, useContext} from 'react'
import AuthContext from '../../context/auth/authContext'
import TransactionContext from '../../context/transaction/transactionContext'
import homepage_img from '../layout/homepage.png';
import report_1_img from '../layout/report_1.png';
import report_2_img from '../layout/report_2.png';
import settings_img from '../layout/settings.png';

const About = () => {
  const authContext = useContext(AuthContext)
  const transactionContext = useContext(TransactionContext);

  const {transactionsByMonth, month, getTransactionsByMonth, setViewport} = transactionContext;

  // used to reset map
  const viewport = {
    latitude: 37.8283459,
    longitude: -96.5794797,
    width: "100%",
    height: "80vh",
    zoom: 3
  }

  useEffect(() => {
    authContext.loadUser()
    getTransactionsByMonth(month);
    setViewport(viewport)
    const data = transactionsByMonth;
    // eslint-disable-next-line
  }, [])

  return (
    <div className="about-page">
      <h1>About</h1>
      <div className="message-2">
        <ul>
          <li>The app is built with React, .NET Core 5.0, and SQL Server.</li>
          <li>Authentication is handled with JSON Web Tokens (JWTs).</li>
          <li>Cloud hosting is provided by Microsoft Azure.</li>
          <li>Third-party services include the Mapbox API for geocoding/displaying location data and ChartJS to create the charts.</li>
          <li>I also developed a program with Selenium and C# that automatically fetches transactions from my financial institution and inserts them into the app each day.</li>
        </ul>
      </div>
      <div className="developer-links">
        <a className="github" href="https://github.com/lorth001/finance_tracker" target="_blank"><i className="fab fa-github"></i></a><a className="linkedin" href="https://www.linkedin.com/in/lukeorth/" target="_blank"><i className="fab fa-linkedin"></i></a>
      </div>
      <h3 className="my-1 bg-dark">Homepage</h3>
      <div className="grid-2">
        <ol>
          <li>Transactions are displayed in “cards” on the right-hand side of the page (ordered by descending date)</li>
          <li>Transaction locations (if supplied) are displayed on the left-hand side of the page in the map</li>
          <li>Transactions can be filtered by date/month using the dropdown or by text using the Filter bar</li>
          <li>New transactions can be added with the Add Transaction button</li>
          <li>The buttons located at the bottom of each transaction “card” can be used to edit, delete, and find the location of the transaction on the map.  The map button will only be visible if a location is supplied</li>
        </ol>
        <img src={homepage_img} alt="homepage"></img>
      </div>
      <h3 className="my-1 bg-dark">Report</h3>
      <div className="grid-2">
        <ol>
          <li>Dropdowns at the top of the page allow you to:</li>
            <ol type="a">
              <li>Filter by date/month</li>
              <li>View information related to Transactions, Categories, or Merchants</li>
              <li>View different charts (Scatter Plot, Bar Chart, Pie Chart, Polar Chart, or Hide)</li>
            </ol>
          <li>Charts are displayed just under the dropdown filters</li>
          <li>A report just under the charts provides detailed information in table format.  Filters are available globally and for each column.  Columns can be sorted by clicking on their headings.  Different information will be shown in the table depending on whether Transactions, Categories, or Merchants is selected from the dropdowns</li>
        </ol>
        <img src={report_1_img} alt="report-1"></img>
      </div>
      <br/>
      <div className="grid-2">
        <span></span>
        <img src={report_2_img} alt="report-2"></img>
      </div>
      <h3 className="my-1 bg-dark">Settings</h3>
      <div className="grid-2">
        <ol>
          <li>A list of all your categories is displayed on this page</li>
          <li>Clicking the dropdown for a category will allow you to change it.  This allows you to update your categories globally, meaning all transactions linked to that category will be affected</li>
        </ol>
        <img src={settings_img} alt="settings"></img>
      </div>
      <div className="footer"></div>
    </div>
  )
}

export default About