export default {
  /**
   * 时间字符串转时间对象
   * @param {*} datetimeStr
   */
  strToTimeObj(datetimeStr) {
    let date = this.strTotimestamp(datetimeStr);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hours: this.fill0(date.getHours()),
      minutes: this.fill0(date.getMinutes()),
      seconds: this.fill0(date.getSeconds())
    };
  },
  /**
   * 秒转天时分秒
   * @param {} seconds s
   */
  secondsToDHMS(seconds) {
    let num = seconds;
    let s = this.fill0(num % 60);
    num = parseInt(num / 60);
    let m = this.fill0(num % 60);
    num = parseInt(num / 60);
    let h = this.fill0(num % 24);
    num = parseInt(num / 24);
    let d = num;
    return { d, h, m, s };
  },
  /**
   * 个位补零
   * @param {} number
   */
  fill0(number) {
    return number < 10 ? `0${(number === 0 ? "0" : number) || ""}` : number;
  }
}