// import { useQuery } from "@tanstack/react-query";
// import { searchCenter } from "../../../libs/api/map/kakao";
// import { QUERY_KEYS } from "@/constant";

// const useGetCenter = (lat: number, lng:number) => {

//   return useQuery({
//     queryKey: [QUERY_KEYS.LOCATION, lat, lng],
//     queryFn: async () => {
//       const cafes = await searchCenter(lat, lng);
//       return cafes;
//     },
//     enabled: !!lat && !!lng, // 위치 정보가 있을 때만 실행
//     staleTime: 1000 * 60 * 5 // 5분 동안 캐싱 유지
//   });
// };

// export default useGetCenter;