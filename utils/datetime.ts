export const DateFormatter = {
  getTimeDifference(createdDate: Date): string {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - createdDate.getTime()) / 1000);

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInMonth = 2592000;
    const secondsInYear = 31536000;

    if (diffInSeconds < secondsInMinute) {
      return `${diffInSeconds} วินาทีผ่านไป`;
    } else if (diffInSeconds < secondsInHour) {
      const diffInMinutes = Math.floor(diffInSeconds / secondsInMinute);
      return `${diffInMinutes} นาทีผ่านไป`;
    } else if (diffInSeconds < secondsInDay) {
      const diffInHours = Math.floor(diffInSeconds / secondsInHour);
      return `${diffInHours} ชั่วโมงผ่านไป`;
    } else if (diffInSeconds < secondsInMonth) {
      const diffInDays = Math.floor(diffInSeconds / secondsInDay);
      return `${diffInDays} วันผ่านไป`;
    } else if (diffInSeconds < secondsInYear) {
      const diffInMonths = Math.floor(diffInSeconds / secondsInMonth);
      return `${diffInMonths} เดือนผ่านไป`;
    } else {
      const diffInYears = Math.floor(diffInSeconds / secondsInYear);
      return `${diffInYears} ปีผ่านไป`;
    }
  },getTimeDifferenceStatus(createdDate: Date): string {
    const now = Date.now();
    const diffInSeconds = Math.floor((createdDate.getTime() - now) / 1000);

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInMonth = 2592000;
    const secondsInYear = 31536000;

    if (diffInSeconds < secondsInMinute) {
      return `${diffInSeconds} วินาที`;
    } else if (diffInSeconds < secondsInHour) {
      const diffInMinutes = Math.floor(diffInSeconds / secondsInMinute);
      return `${diffInMinutes} นาที`;
    } else if (diffInSeconds < secondsInDay) {
      const diffInHours = Math.floor(diffInSeconds / secondsInHour);
      return `${diffInHours} ชั่วโมง`;
    } else if (diffInSeconds < secondsInMonth) {
      const diffInDays = Math.floor(diffInSeconds / secondsInDay);
      return `${diffInDays} วัน`;
    } else if (diffInSeconds < secondsInYear) {
      const diffInMonths = Math.floor(diffInSeconds / secondsInMonth);
      return `${diffInMonths} เดือน`;
    } else {
      const diffInYears = Math.floor(diffInSeconds / secondsInYear);
      return `${diffInYears} ปี`;
    }
  },
  getTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  },
  getDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day < 10 ? "0" + day : day}/${
      month < 10 ? "0" + month : month
    }/${year}`;
  },
  getStringDateTime(date: Date): string {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday =
      date.toDateString() ===
      new Date(now.setDate(now.getDate() - 1)).toDateString();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (isToday) {
      return `วันนี้ ${hours}:${minutes}`;
    } else if (isYesterday) {
      return `เมื่อวานนี้ ${hours}:${minutes}`;
    } else {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
  },
};
