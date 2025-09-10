const KAKAO_LOGIN_CONFIG = {
    CLIENT_ID: process.env.NEXT_PUBLIC_KAKAO_OAUTH_REST_API_KEY!,
    REDIRECT_URI: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ?? 'http://localhost:3000/oauth/kakaoCallback',
}

type Provider = 'kakao' | 'email'

type LoginFunctions = {
    kakao: () => void
    email: () => void
}

export const Login: LoginFunctions = {
    kakao: () => {
        const { CLIENT_ID, REDIRECT_URI } = KAKAO_LOGIN_CONFIG

        // (선택) CSRF 방지용 state 생성/저장
        const state = Math.random().toString(36).slice(2)
        sessionStorage.setItem('kakao_oauth_state', state)

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
        })

        // ✅ 외부(Kakao)로 리다이렉트
        window.location.href = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`
    },
    email: () => {
        // email 페이지로 이동
        window.location.href = '/sign-in/email'
    },
}

export const useLogin = (provider: Provider): (() => void) => {
    switch (provider) {
        case 'kakao':
            return Login.kakao
        case 'email':
            return Login.email
        default:
            throw new Error(`지원하지 않는 provider: ${provider}`)
    }
}
