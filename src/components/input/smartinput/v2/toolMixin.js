export default {
    methods: {
        /**
         * 字符串指定位置插入
         * @param oriStr 原始字符串
         * @param start 指定位置
         * @param str 新插入字符串
         */
        _splice(oriStr, start, str) {
            return oriStr.slice(0, start) + str + oriStr.slice(start);
        },
        /**
         * 获取当前光标位置
         * @returns {number[]} [开始位置,结束位置]
         * @private
         */
        _getCurPosition() {
            return [this.inputEle.selectionStart, this.inputEle.selectionEnd];
        },
        /**
         * 设置当前光标位置
         * @param el 元素
         * @param start 开始位置
         * @param end 结束位置
         * @private
         */
        _setCurPosition(el, start, end) {
            el.focus();
            el.setSelectionRange(start, end);
        },
        // 计算输入长度
        _calcLength() {
            let copyStr = this.inputVal;
            let wordLen = 0;
            if (this.cache && this.cache.length) {
                this.cache.forEach(item => {
                    copyStr = copyStr.replace(item.value, '');
                    wordLen += item.len;
                });
            }
            if (this.doubleCodeAble) {
                const doubleStr = copyStr.match(this.doubleCode);
                let doubleStrLen = doubleStr ? doubleStr.length : 0;
                const othLen = copyStr.length - doubleStrLen;
                wordLen += (doubleStrLen + Math.ceil(othLen / 2));
            } else {
                wordLen += copyStr.length;
            }
            return wordLen
        },
        // 生成词包展示值
        _generateWordLabel(str) {
            let res = "";
            switch (this.wordType) {
                case 1:
                    res = `{${str}}`
                    break;
                case 2:
                    res = `[${str}]`
                    break;
                case 3:
                    res = `(${str})`
                    break;
                default:
                    break;
            }
            return res;
        },
        // 替换指定位置字符串
        _spliceStr(oriStr, start, end, str) {
            let tmp = oriStr;
            console.log(oriStr, start, end, str)
            console.log(tmp, tmp.slice(0, start), str, tmp.slice(end));
            return tmp.slice(0, start) + str + tmp.slice(end);
        }
    }
};
