
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './components/Home.jsx'
import LoginPage from './components/LoginPage.jsx';
import VisitForm from './components/VisitForm.jsx';
import UpdateForm from './components/UpdateForm.jsx';
import QueryPage from './components/QueryPage.jsx';
import AttractionForm from './components/AttractionForm.jsx';
import ActivityForm from './components/ActivityForm.jsx';
import './index.css';

function App() {

  return (
    <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/setvisit" element={<VisitForm />} />
          <Route path="/addattraction" element={<AttractionForm />} />
          <Route path="/addactivity" element={<ActivityForm />} />
          <Route path="/queries" element={<QueryPage />} />
          <Route path="/update" element={<UpdateForm />} />
        </Routes>
      <Footer />
    </BrowserRouter>
  );

}

export default App




