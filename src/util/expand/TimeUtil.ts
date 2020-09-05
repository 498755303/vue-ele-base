/*
 * @Description: 时间相关Util
 * @LastEditors: HL
 * @LastEditTime: 2020-07-02 14:19:10
 */
// 时间补位
const prefixInteger = function (num, length) {
  return (Array(length).join('0') + num).slice(-length);
};

/**
 * 剩余时间计算参数
 */
interface TimeLeftParam {
  nowTime: number,
  endTime: number
}


export class TimeUtil {
  /**
   * 获取时间段内的时间数组
   * @param {*} startTime hh:mm:ss
   * @param {*} endTime hh:mm:ss
   * @param {*} step 步长秒
   * @param {*} type 1 返回hh:mm:ss 其他返回hh:mm
   */
  public static getIntervalsTime(
    startTime = '00:00:00',
    endTime = '24:00:00',
    step = 60 * 60,
    type = 2
  ) {
    let res = [];
    let sT = startTime.split(':');
    let eT = endTime.split(':');
    let startTimeStamp =
      parseInt(sT[0]) * 60 * 60 + (parseInt(sT[1]) * 60) + parseInt(sT[2]);
    let endTimeStamp =
      parseInt(eT[0]) * 60 * 60 + (parseInt(eT[1]) * 60) + parseInt(eT[2]);
    while (startTimeStamp <= endTimeStamp) {
      let h = parseInt((startTimeStamp / 3600).toString());
      let m = parseInt(((startTimeStamp % 3600) / 60).toString());
      let s = parseInt(((startTimeStamp % 3600) % 60).toString());
      if (type === 1) {
        res.push(`${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`);
      } else {
        res.push(
          `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${
            s < 10 ? '0' + s : s
          }`
        );
      }

      startTimeStamp = startTimeStamp + step;
    }
    return res;
  };


  /**
   * 剩余时间计算
   * @param timeParam: TimeLeftParam 起止时间差
   */
  public static timeLeft(timeParam: TimeLeftParam): object {
    let year = Math.floor(
      (timeParam.endTime - timeParam.nowTime) / 3600 / 24 / 31 / 12
    );
    let mouth = Math.floor(
      ((timeParam.endTime - timeParam.nowTime) % (3600 * 24 * 31 * 12)) /
      3600 /
      24 /
      31
    );
    let day = Math.floor(
      ((timeParam.endTime - timeParam.nowTime) % 32140800) / 86400
    );
    let hourTm = Math.floor(
      (((timeParam.endTime - timeParam.nowTime) % 32140800) % 86400) / 3600
    );
    let hourStr = hourTm < 10 ? prefixInteger(hourTm, 2) : hourTm;
    let minTm = Math.floor(
      ((((timeParam.endTime - timeParam.nowTime) % 32140800) % 86400) % 3600) / 60
    );
    let minStr = minTm < 10 ? prefixInteger(minTm, 2) : minTm;
    let secondTm =
      (Math.floor(timeParam.endTime - timeParam.nowTime) %
        (32140800 * 86400 * 3600)) %
      60;
    let secondStr = secondTm < 10 ? prefixInteger(secondTm, 2) : secondTm;
    return {
      year: year,
      mouth: mouth,
      day: day,
      hourTm: hourStr,
      minTm: minStr,
      secondTm: secondStr
    };
  };
}