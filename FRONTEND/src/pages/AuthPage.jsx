import React from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'

const AuthPage = () => {

    const { mode } = useSearch({ from: '/auth' })
    const navigate = useNavigate()

    const login = mode !== 'register'

    // LoginForm / RegisterForm call state(true) -> Login, state(false) -> Register
    const setLogin = (isLogin) => {
        navigate({ to: '/auth', search: { mode: isLogin ? 'login' : 'register' } })
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            {login ? <LoginForm state={setLogin} /> : <RegisterForm state={setLogin} />}
        </div>
    )
}

export default AuthPage