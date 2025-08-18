export const timeFormat = (time: string) => {
  return time.length === 5 ? time : `0${time}`;
};
