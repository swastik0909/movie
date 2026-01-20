import { Routes, Route } from "react-router-dom";

import Trending from "@/components/Trending/Trending";
import MovieList from "@/components/MovieList";
import TvShows from "@/components/TvShowsList";
import SearchList from "@/components/SearchList";
import Player from "@/components/Player";
import PlayerTV from "@/components/PlayerTv";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Profile from "@/pages/Profile";
import Watchlist from "@/pages/Watchlist";
import ContinueWatching from "@/pages/ContinueWatching";
import MovieDetails from "@/pages/MovieDetails";

import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";

import AdminLayout from "@/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminActivity from "@/pages/admin/AdminActivity";
import AdminMostWatched from "@/pages/admin/AdminMostWatched";
import TvShowDetails from "@/pages/TvShowDetails";
import AdminComments from "@/pages/admin/AdminComments";
import ForgotPassword from "@/pages/auth/ForgotPassword";

const AllRoutes = () => {
  return (
    <Routes>
      {/* ---------- PUBLIC ROUTES ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ---------- USER ROUTES ---------- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Trending />
          </ProtectedRoute>
        }
      />

      <Route
        path="/movies"
        element={
          <ProtectedRoute>
            <MovieList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tvshows"
        element={
          <ProtectedRoute>
            <TvShows />
          </ProtectedRoute>
        }
      />

      <Route
        path="/search/:searchName"
        element={
          <ProtectedRoute>
            <SearchList />
          </ProtectedRoute>
        }
      />

      {/* 🎬 MOVIE DETAILS (NEW – CORRECT PLACE) */}
      <Route
        path="/movie/:movieId"
        element={
          <ProtectedRoute>
            <MovieDetails />
          </ProtectedRoute>
        }
      />

      {/* 🎬 MOVIE PLAYER */}
      <Route
        path="/player/:playerId"
        element={
          <ProtectedRoute>
            <Player />
          </ProtectedRoute>
        }
      />

      {/* 📺 TV PLAYER */}
      <Route
        path="/tv/:tvId/:season/:episode"
        element={
          <ProtectedRoute>
            <PlayerTV />
          </ProtectedRoute>
        }
      />

      <Route
        path="/continue"
        element={
          <ProtectedRoute>
            <ContinueWatching />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/watchlist"
        element={
          <ProtectedRoute>
            <Watchlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tvshow/:tvId"
        element={
          <ProtectedRoute>
            <TvShowDetails />
          </ProtectedRoute>
        }
      />

      {/* ---------- ADMIN ROUTES (SEPARATE APP) ---------- */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="activity" element={<AdminActivity />} />
        <Route path="most-watched" element={<AdminMostWatched />} />
        <Route path="comments" element={<AdminComments />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
