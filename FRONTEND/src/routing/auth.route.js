import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "./routeTree"
import AuthPage from "../pages/AuthPage"

export const authRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth',
    component: AuthPage,
    // /auth?mode=register opens the Register form, anything else opens Login
    validateSearch: (search) => ({
        mode: search.mode === 'register' ? 'register' : 'login',
    }),
})