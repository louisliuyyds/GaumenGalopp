import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Restaurants from "./pages/Restaurant";
import RestaurantDetail from "./pages/RestaurantDetail";
import GerichtDetail from "./pages/GerichtDetail";
import EditRestaurantInfos from "./pages/EditRestaurantInfos";
import EditOpeningHours from "./pages/EditOpeningHours";
import EditMenu from "./pages/EditMenu";
import KundeHome from './pages/KundeHome';
import Warenkorb from "./pages/Warenkorb";
import KundeProfil from './pages/KundeProfil';
import RestaurantProfil from './pages/RestaurantProfil';
import Bestellhistorie from "./pages/Bestellhistorie";
import colors from './theme/colors';

const AppContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 100vh;
    background-color: ${colors.background.main};
`;

const ContentArea = styled.div`
    margin-left: 220px;
    padding: 40px;
    width: 100%;
    overflow-y: auto;
`;

//Smart Home Redirect basierend auf User-Type
function HomeRedirect() {
    const { user, isKunde } = useAuth();

    if (isKunde) {
        return <Navigate to="/kunde" replace />;
    }
    return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
    return (
        <Routes>
            {/* Öffentliche Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Geschützte Routes mit Sidebar */}
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <AppContainer>
                            <Sidebar />
                            <ContentArea>
                                <Routes>
                                    {/* Smart Home Route --> Erkennt, ob es ein Kunde/ Restaurant ist und setzt dementsprechend den Home Link nach dem Login z.B. */}
                                    <Route path="/" element={<HomeRedirect />} />

                                    {/* Dashboard - nur für Restaurants */}
                                    <Route
                                        path="/dashboard"
                                        element={
                                            <ProtectedRoute requiredType="restaurant">
                                                <Dashboard />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Restaurant Routes - FÜR ALLE zugänglich */}
                                    <Route path="/restaurants" element={<Restaurants />} />
                                    <Route path="/restaurants/:id" element={<RestaurantDetail />} />
                                    <Route path="/restaurants/:restaurantId/gericht/:gerichtId" element={<GerichtDetail />} />

                                    {/* Edit Routes - nur für Restaurants */}
                                    <Route
                                        path="/restaurants/:id/edit"
                                        element={
                                            <ProtectedRoute requiredType="restaurant">
                                                <EditRestaurantInfos />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/restaurants/:id/edit/opening"
                                        element={
                                            <ProtectedRoute requiredType="restaurant">
                                                <EditOpeningHours />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/restaurants/:id/edit/menu"
                                        element={
                                            <ProtectedRoute requiredType="restaurant">
                                                <EditMenu />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Restaurant Profil Route */}
                                    <Route
                                        path="/restaurants/profil"
                                        element={
                                            <ProtectedRoute requiredType="restaurant">
                                                <RestaurantProfil />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Kunden Routes - nur für Kunden */}
                                    <Route
                                        path="/kunde"
                                        element={
                                            <ProtectedRoute requiredType="kunde">
                                                <KundeHome />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/kunde/restaurants"
                                        element={
                                            <ProtectedRoute requiredType="kunde">
                                                <Restaurants />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/kunde/warenkorb"
                                        element={
                                            <ProtectedRoute requiredType="kunde">
                                                <Warenkorb />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/kunde/profil"
                                        element={
                                            <ProtectedRoute requiredType="kunde">
                                                <KundeProfil />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/kunde/bestellhistorie"
                                        element={
                                            <ProtectedRoute requiredType="kunde">
                                                <Bestellhistorie />
                                            </ProtectedRoute>
                                        }
                                    />

                                    {/* Bestellhistorie auch für Restaurants */}
                                    <Route
                                        path="/bestellhistorie"
                                        element={<Bestellhistorie />}
                                    />

                                    {/* Fallback */}
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </ContentArea>
                        </AppContainer>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;