import { create } from 'zustand';

type EmailCheck = {
  email: string;
  password: string;
  passwordCheck: string;
};

type SignUp = {
  terms: boolean;
  phoneNumber: string;
  emailCheck: EmailCheck;
  complete: boolean;
};

type Profile = {
  nickname: string;
  address: string;
  favor: string;
  prefer_sports: string;
  img: File;
};

type Store = {
  signUp: SignUp;
  profile: Profile;
  updateSignUp: <K extends keyof SignUp>(key: K, value: SignUp[K]) => void;
  patchEmailCheck: (patch: Partial<EmailCheck>) => void;
  updateProfile: <K extends keyof Profile>(key: K, value: Profile[K]) => void;
  resetSignUp: () => void;
  resetProfile: () => void;
};

const SIGNUP_INIT: SignUp = {
  terms: false,
  phoneNumber: '',
  emailCheck: { email: '', password: '', passwordCheck: '' },
  complete: false,
};

const PROFILE_INIT: Profile = {
  nickname: '',
  address: '',
  favor: '',
  prefer_sports: '',
  img: undefined as unknown as File,
};

const useSignUpStore = create<Store>((set, get) => ({
  signUp: SIGNUP_INIT,
  profile: PROFILE_INIT,

  updateSignUp: (key, value) =>
    set((s) => ({ signUp: { ...s.signUp, [key]: value } as SignUp })),

  patchEmailCheck: (patch) =>
    set((s) => ({
      signUp: { ...s.signUp, emailCheck: { ...s.signUp.emailCheck, ...patch } },
    })),

  updateProfile: (key, value) =>
    set((s) => ({ profile: { ...s.profile, [key]: value } as Profile })),

  resetSignUp: () => set({ signUp: SIGNUP_INIT }),
  resetProfile: () => set({ profile: PROFILE_INIT }),
}));

export default useSignUpStore;
