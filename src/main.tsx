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
import Home from './pages/Home.tsx';
import NotFound from './pages/NotFound.tsx';
import ShipmentDetails from './pages/ShipmentDetails.tsx';
import { List } from './components/Shipment/';
import EventNew from './pages/EventNew.tsx';
import ShipmentNew from './pages/ShipmentNew.tsx';

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/newshipment" element={<ShipmentNew />} />
      <Route path="/logevent" element={<EventNew />} />
      <Route path="/shipments" element={<List />} />
      <Route path="/shipments/:id" element={<ShipmentDetails />} />
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
