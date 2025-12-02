export const calculateDuration = (startedAt: Date, currentTime: Date) => {
    const timeDifferenceMs = (currentTime.getTime() - startedAt.getTime());
    const seconds = Math.floor(timeDifferenceMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

  return { seconds, minutes, remainingSeconds }
}