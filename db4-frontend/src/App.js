import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import MainScreen from './screens/mainScreen/MainScreen';
// import AuthScreen from './screens/authScreens/AuthScreen';
import LoginPage from './screens/authScreens/loginScreen/LoginPage';
import RegisterPage from './screens/authScreens/registerScreen/RegisterPage';
import MyWorkspace from './screens/myWorkspace/MyWorkspace';
import Dashboards from './screens/dashboards/Dashboards';
import Directories from './screens/directories/Directories';
import HomeScreen from './screens/HomeScreen';
// import MyTeam from './screens/myTeam/MyTeam';
import Favourites from './screens/favourites/Favourites';
import TeamPerformance from './screens/teamPerformance/TeamPerformance';
import Talent from './screens/talent/Talent';
import TimeOff from './screens/timeOff/TimeOff';
import SpendManagement from './screens/spendManagement/SpendManagement';
import Benefits from './screens/benefits/Benefits';
import Pay from './screens/pay/Pay';
import BigData from './screens/bigData/BigData';
import Expenses from './screens/expenses/Expenses';
import Birthdays from './screens/birthdays/Birthdays';
import Anniversaries from './screens/anniversaries/Anniversaries';
import EmployeesScreen from './screens/EmployeesScreen';
import RegisterScreen from './screens/RegisterScreen';
import Dashboard from './screens/templates/Dashboard';
import PrivateRoute from './screens/PrivateRoute';
import { Container } from 'react-bootstrap';
import { SidebarProvider } from './Context';

function App() {
  return (
    <div >
      <Router>
      <SidebarProvider>
        <Header />
        <Container fluid style={{ padding: "0", margin: "0", width: "100%" }}>
          <Routes>
            <Route path='/' element={<MainScreen />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/home' element={<HomeScreen />} />
            <Route element={<PrivateRoute />}>
              <Route path='/My Team' element={<EmployeesScreen />} />
              <Route path='/My Workspace' element={<MyWorkspace />} />
              <Route path='/Dashboards' element={<Dashboard />} />
              <Route path='/Directory' element={<Directories />} />
              <Route path='/Favorites' element={<Favourites />} />
              <Route path='/Team Performance' element={<TeamPerformance />} />
              <Route path='/Talent' element={<Talent />} />
              <Route path='/Time Off' element={<TimeOff />} />
              <Route path='/Spend Management' element={<SpendManagement />} />
              <Route path='/Benefits' element={<Benefits />} />
              <Route path='/Pay' element={<Pay />} />
              <Route path='/Big Data Analytics' element={<BigData />} />
              <Route path='/Expenses' element={<Expenses />} />
              <Route path='/Birthdays' element={<Birthdays />} />
              <Route path='/Anniversaries' element={<Anniversaries />} />
              <Route path='/Personal Information' element={<RegisterScreen />} />
            </Route>
            <Route path='/hr' element={<Dashboards />} />
          </Routes>
        </Container>
        </SidebarProvider>
      </Router>
    </div>
  );
}

export default App;
