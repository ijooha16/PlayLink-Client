import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constant';

const useGetCenter = (lat: number, lng: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LOCATION, lat, lng],
    queryFn: async () => {
      // TODO: Implement searchCenter API function when map/kakao module is created
      return null;
    },
    enabled: false, // Disabled until map API is implemented
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetCenter;