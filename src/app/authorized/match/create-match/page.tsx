import { PATHS } from '@/constant';
import { redirect } from 'next/navigation';

const CreateMatch = () => {
  redirect(PATHS.MATCH.CREATE_MATCH + '/type');
};

export default CreateMatch;
