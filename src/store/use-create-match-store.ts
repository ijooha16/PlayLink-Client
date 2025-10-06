import { create } from 'zustand';

export type LocationData = {
  placeName: string;
  placeAddress: string;
  placeLocation: string; // "y, x" 형식
};

type CreateMatchData = {
  // Step 1: Type
  matchType: number | null; // 0: 운동 함께하기, 1: 경기 보러가기

  // Step 2: Sports
  sportType: number | null;

  // Step 3: Create
  date: string; // "yyyy-MM-dd"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  leastSize: number;
  maxSize: number;
  matchLevel: number; // 비트플래그
  gender: number; // 0: 제한없음, 1: 남자, 2: 여자
  generation: number; // 비트플래그
  location: LocationData | null;

  // Step 4: Description
  title: string;
  contents: string;
};

type Store = {
  matchData: CreateMatchData;
  updateMatchType: (type: 'play' | 'watch') => void;
  updateSportType: (sportId: number) => void;
  updateDateTime: (date: string, startTime: string, endTime: string) => void;
  updatePeople: (min: number, max: number) => void;
  updateLevels: (levels: string[]) => void;
  updateGender: (gender: string) => void;
  updateGeneration: (ages: string[]) => void;
  updateLocation: (location: LocationData) => void;
  updateDescription: (title: string, contents: string) => void;
  reset: () => void;
  getApiPayload: () => {
    title: string;
    contents: string;
    matchType: number;
    sportType: number;
    date: string;
    startTime: string;
    endTime: string;
    leastSize: number;
    maxSize: number;
    matchLevel: number;
    gender: number;
    generation: number;
    placeAddress: string;
    placeLocation: string;
  };
};

const INITIAL_STATE: CreateMatchData = {
  matchType: null,
  sportType: null,
  date: '',
  startTime: '',
  endTime: '',
  leastSize: 2,
  maxSize: 2,
  matchLevel: 0,
  gender: 0,
  generation: 0,
  location: null,
  title: '',
  contents: '',
};

// 레벨 ID를 비트플래그로 변환 (lv1 -> 0, lv2 -> 1, ...)
const levelsTobitFlag = (levels: string[]): number => {
  if (levels.length === 0) return 0;
  return levels.reduce((acc, level) => {
    const match = level.match(/lv(\d+)/);
    if (match) {
      const index = parseInt(match[1]) - 1; // lv1 -> 0, lv2 -> 1
      return acc | (1 << index);
    }
    return acc;
  }, 0);
};

// 연령대 ID를 비트플래그로 변환 (20s -> 0, 30s -> 1, 40s -> 2, 50s -> 3)
const agesToBitFlag = (ages: string[]): number => {
  if (ages.length === 0) return 0;
  const ageMap: Record<string, number> = {
    '20s': 0,
    '30s': 1,
    '40s': 2,
    '50s': 3,
  };
  return ages.reduce((acc, age) => {
    const index = ageMap[age];
    if (index !== undefined) {
      return acc | (1 << index);
    }
    return acc;
  }, 0);
};

// 성별 ID를 숫자로 변환
const genderToNumber = (gender: string): number => {
  const genderMap: Record<string, number> = {
    all: 0,
    male: 1,
    female: 2,
  };
  return genderMap[gender] ?? 0;
};

const useCreateMatchStore = create<Store>((set, get) => ({
  matchData: INITIAL_STATE,

  updateMatchType: (type: 'play' | 'watch') =>
    set((state) => ({
      matchData: { ...state.matchData, matchType: type === 'play' ? 0 : 1 },
    })),

  updateSportType: (sportId: number) =>
    set((state) => ({
      matchData: { ...state.matchData, sportType: sportId },
    })),

  updateDateTime: (date: string, startTime: string, endTime: string) =>
    set((state) => ({
      matchData: { ...state.matchData, date, startTime, endTime },
    })),

  updatePeople: (min: number, max: number) =>
    set((state) => ({
      matchData: { ...state.matchData, leastSize: min, maxSize: max },
    })),

  updateLevels: (levels: string[]) =>
    set((state) => ({
      matchData: { ...state.matchData, matchLevel: levelsTobitFlag(levels) },
    })),

  updateGender: (gender: string) =>
    set((state) => ({
      matchData: { ...state.matchData, gender: genderToNumber(gender) },
    })),

  updateGeneration: (ages: string[]) =>
    set((state) => ({
      matchData: { ...state.matchData, generation: agesToBitFlag(ages) },
    })),

  updateLocation: (location: LocationData) =>
    set((state) => ({
      matchData: { ...state.matchData, location },
    })),

  updateDescription: (title: string, contents: string) =>
    set((state) => ({
      matchData: { ...state.matchData, title, contents },
    })),

  reset: () => set({ matchData: INITIAL_STATE }),

  getApiPayload: () => {
    const data = get().matchData;
    return {
      title: data.title,
      contents: data.contents,
      matchType: data.matchType ?? 0,
      sportType: data.sportType ?? 0,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      leastSize: data.leastSize,
      maxSize: data.maxSize,
      matchLevel: data.matchLevel,
      gender: data.gender,
      generation: data.generation,
      placeAddress: data.location?.placeAddress ?? '',
      placeLocation: data.location?.placeLocation ?? '',
    };
  },
}));

export default useCreateMatchStore;
