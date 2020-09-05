/** 一周的时间转换
 * @param {*} scheduleTime 时间字符串,如 100010101(7 * 48 位)
 * @returns {"星期一":[["07:00","08:30"]],"星期二":[]}类型数据
 */
const schedlueWeek2Time = scheduleTime => {
  const scheduleLen = scheduleTime.length;
  if (scheduleLen != 7 * 48) {
    new Error('传入的字符串不正确');
    return;
  }
  let scheduleList = [];
  let res = {};
  for (var i = 0; i < scheduleLen; i++) {
    if (i % 48 === 0) {
      scheduleList.push(scheduleTime.substr(i, 48));
    }
  }
  scheduleList.forEach((v, i) => {
    res[num2Week(i)] = schedule2Time(v);
  });
  return res;
};
/** 时间字符串转时间段
 * @param {*} scheduleTime 时间字符串,如 100010101(48位,1天的)
 * @return ["07:00","08:30"]的二维数组
 */
const schedule2Time = scheduleTime => {
  if (!scheduleTime) return '不限';
  if (scheduleTime.length !== 48) throw new Error('参数错误');
  if (scheduleTime.indexOf('0') === -1 || scheduleTime.indexOf('1') === -1) {
    return [];
  }
  let startFlag = false;
  let start;
  let end;
  let res = [];
  for (var i = 0; i < scheduleTime.length; i++) {
    switch (scheduleTime.charAt(i)) {
    case '1':
      if (!startFlag) {
        start = i;
        startFlag = true;
      }
      break;
    case '0':
      if (startFlag) {
        end = i - 1;
        startFlag = false;
        res.push(index2Time(start, end));
        start = end = false;
      }
      break;
    default:
      break;
    }
    if (i % 48 === 47) {
      if (start && !end) {
        res.push(index2Time(start, i));
        start = end = false;
        startFlag = 0;
      }
      return res;
    }
  }
};
function index2Time (start, end) {
  let startTime;
  let endTime;
  let tmp = {
    start1: (start % 48) % 2,
    start2: (start % 48) / 2,
    start3: Math.floor((start % 48) / 2),
    end1: (end % 48) % 2,
    end2: (end % 48) / 2,
    end3: Math.ceil((end % 48) / 2)
  };
  if (tmp.start1 === 0) {
    startTime = (tmp.start2 < 10 ? '0' + tmp.start2 : tmp.start2) + ':00';
  } else {
    startTime = (tmp.start3 < 10 ? '0' + tmp.start3 : tmp.start3) + ':30';
  }
  if (tmp.end1 === 0) {
    endTime = (tmp.end2 < 10 ? '0' + tmp.end2 : tmp.end2) + ':30';
  } else {
    endTime = (tmp.end3 < 10 ? '0' + tmp.end3 : tmp.end3) + ':00';
  }
  return [startTime, endTime];
}
// 数字0-6转星期
function num2Week (num) {
  let res;
  switch (num) {
  case 0:
    res = '星期一';
    break;
  case 1:
    res = '星期二';
    break;
  case 2:
    res = '星期三';
    break;
  case 3:
    res = '星期四';
    break;
  case 4:
    res = '星期五';
    break;
  case 5:
    res = '星期六';
    break;
  case 6:
    res = '星期日';
    break;
  default:
    break;
  }
  return res;
}
/** 时间段数组转时间段字符串
 * @param {*} dateList 时间段数组
 * ["05:00", "07:30"],["08:00", "24:00"]  转  "000000000011111011111111111111111111111111111111"
 */
const time2Schedule = dateList => {
  let allStr = new Array(48).fill(0).join('');
  if (!dateList) return allStr;
  if (dateList === '不限') return allStr;
  if (dateList && dateList instanceof Array) {
    let start;
    let end;
    let res = allStr;
    dateList.forEach((value, index) => {
      if (value && value instanceof Array && value.length === 2) {
        start = time2Position(value[0]);
        end = time2Position(value[1]);
        res = replaceStrByposition(
          res,
          start,
          end,
          new Array(end - start).fill(1).join('')
        );
      }
    });
    return res;
  } else {
    throw new Error('输入参数错误');
  }
};
// 时间hh:mm转位置
function time2Position (timeStr) {
  let tmp = timeStr.split(':');
  let p;
  switch (tmp[1]) {
  case '00':
    p = tmp[0] * 2;
    break;
  case '30':
    p = tmp[0] * 2 + 1;
    break;
  default:
    break;
  }
  return p;
}
/** 替换指定位置内的字符串
 * @param {*} oStr 原始字符串
 * @param {*} start 起始位置
 * @param {*} end 结束位置
 * @param {*} replaceStr 替换成的字符串
 */
function replaceStrByposition (oStr, start, end, replaceStr) {
  return oStr.substring(0, start) + replaceStr + oStr.substring(end);
}
export { schedule2Time, schedlueWeek2Time, time2Schedule };
