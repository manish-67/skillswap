import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CreateOfferPage from './pages/CreateOfferPage';
import CreateRequestPage from './pages/CreateRequestPage';
import OfferListPage from './pages/OfferListPage';
import RequestListPage from './pages/RequestListPage';
import OfferDetailsPage from './pages/OfferDetailsPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import MessageListPage from './pages/MessageListPage';
import ConversationPage from './pages/ConversationPage';
import ProposeExchangePage from './pages/ProposeExchangePage';
import ExchangeListPage from './pages/ExchangeListPage';
import NotificationListPage from './pages/NotificationListPage'; // Import new page
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Header />
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Public lists */}
          <Route path="/offers" element={<OfferListPage />} />
          <Route path="/offers/:id" element={<OfferDetailsPage />} />
          <Route path="/requests" element={<RequestListPage />} />
          <Route path="/requests/:id" element={<RequestDetailsPage />} />

          {/* Private Routes */}
          <Route path="" element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/offers/create" element={<CreateOfferPage />} />
            <Route path="/requests/create" element={<CreateRequestPage />} />
            {/* Messaging routes */}
            <Route path="/messages" element={<MessageListPage />} />
            <Route path="/messages/:otherUserId" element={<ConversationPage />} />
            {/* Exchange routes */}
            <Route path="/exchanges/propose/:targetUserId" element={<ProposeExchangePage />} />
            <Route path="/exchanges" element={<ExchangeListPage />} />
            {/* Notification route */}
            <Route path="/notifications" element={<NotificationListPage />} /> {/* New route */}

            {/* Add more protected routes here later, e.g., /offers/edit/:id, /my-exchanges */}
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;