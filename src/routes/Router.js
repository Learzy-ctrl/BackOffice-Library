import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const About = lazy(() => import("../views/About.js"));
const Alerts = lazy(() => import("../views/ui/Alerts"));
const Badges = lazy(() => import("../views/ui/Badges"));
const Buttons = lazy(() => import("../views/ui/Buttons"));
const Cards = lazy(() => import("../views/ui/Cards"));
const Grid = lazy(() => import("../views/ui/Grid"));
const Tables = lazy(() => import("../views/ui/Tables"));
const Forms = lazy(() => import("../views/ui/Forms"));
const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));
const AgregarAutor = lazy(() => import ("../views/AgregarAutor.js"));
const AgregarLibro = lazy(() => import ("../views/AgregarLibro.js"));
const DetalleAutor = lazy(() => import ("../views/DetalleAutor.js"));
const Cupones = lazy(() => import ("../components/dashboard/CuponesTable.js"));
const AgregarCupon = lazy(() => import ("../views/AgregarCupon.js"));
const DetalleCupon = lazy(() => import ("../views/DetalleCupon.js"));

/*****Routes******/

const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/starter" /> },
      { path: "/starter", exact: true, element: <Starter /> },
      { path: "/about", exact: true, element: <About /> },
      { path: "/alerts", exact: true, element: <Alerts /> },
      { path: "/badges", exact: true, element: <Badges /> },
      { path: "/buttons", exact: true, element: <Buttons /> },
      { path: "/cards", exact: true, element: <Cards /> },
      { path: "/grid", exact: true, element: <Grid /> },
      { path: "/table", exact: true, element: <Tables /> },
      { path: "/forms", exact: true, element: <Forms /> },
      { path: "/breadcrumbs", exact: true, element: <Breadcrumbs /> },
      { path: "/agregarAutor", exact: true, element: <AgregarAutor/>},
      { path: "/agregarLibro", exact: true, element: <AgregarLibro/>},
      { path: "/detalleAutor/:guid", exact: true, element: <DetalleAutor/>},
      { path: "/Cupones", exact: true, element: <Cupones/>},
      { path: "/AgregarCupon", exact: true, element: <AgregarCupon/>},
      { path: "/DetalleCupon/:id", exact: true, element: <DetalleCupon/>}
    ],
  },
];

export default ThemeRoutes;
