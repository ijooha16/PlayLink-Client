import BaseInput from '@/components/ui/input';
import { EmailInput } from './EmailInput';
import { PhoneInput } from './PhoneInput';
import { PasswordInput } from './PasswordInput';
import { CodeInput } from './CodeInput';
import { NicknameInput } from './NicknameInput';
import { AddressInput } from './AddressInput';

export const Input = Object.assign(BaseInput, {
  Email: EmailInput,
  Phone: PhoneInput,
  Password: PasswordInput,
  Code: CodeInput,
  Nickname: NicknameInput,
  Address: AddressInput,
});

export type {
  EmailInputProps,
  PhoneInputProps,
  PasswordInputProps,
  CodeInputProps,
  NicknameInputProps,
  AddressInputProps
} from './types';