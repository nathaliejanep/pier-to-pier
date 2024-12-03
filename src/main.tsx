import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import AppProvider from './AppContext.tsx';
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import LogEvent from './pages/LogEvent.tsx';
import EventHistory from './pages/EventHistory.tsx';
import Home from './pages/Home.tsx';
import NotFound from './pages/NotFound.tsx';
import EventDetails from './pages/EventDetails.tsx';

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/logevent" element={<LogEvent />} />
      <Route path="/eventhistory" element={<EventHistory />} />
      <Route path="eventhistory/:id" element={<EventDetails />} />
      {/* <Route path="*" element={<Navigate replace to="notfound" />} /> */}
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>,
);
