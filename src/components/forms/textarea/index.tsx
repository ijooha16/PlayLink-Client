import BaseTextArea from '@/components/ui/textarea';
import { TextAreaInput } from './TextAreaInput';

export const TextArea = Object.assign(TextAreaInput, {
  Base: BaseTextArea,
});

export type { TextAreaInputProps } from './types';

export default TextArea;
