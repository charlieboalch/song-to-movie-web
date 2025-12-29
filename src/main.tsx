import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Home} from "./Home.tsx";
import {createTheme, ThemeProvider} from "@mui/material";
import {createBrowserRouter, RouterProvider} from "react-router";
import {About} from "./About.tsx";
import {MainLayout} from "./MainLayout.tsx";

const theme = createTheme({
    palette: {
        mode: 'light',
    },
});

const router = createBrowserRouter([
    {
        Component: MainLayout,
        children: [
            {
                path: "/",
                element: <Home />,
                index: true
            },
            {
                path: "/about",
                element: <About />
            }
        ]
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
