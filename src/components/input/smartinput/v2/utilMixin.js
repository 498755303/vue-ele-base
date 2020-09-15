export default {
    data() {
        return {
            // 词包Map,用于匹配
            wordMapCache: this.wordMap ? this.wordMap : {},
            wordReg: {
                single: "",
                all: ""
            }
        }
    },
    methods: {
        // 生成词包匹配正则
        _generateWordRegxp() {
            switch (this.wordType) {
                case 1:
                    this.wordReg.single = new RegExp(/\{(.*?)\}/);
                    this.wordReg.all = new RegExp(/\{(.*?)\}/, 'g');
                    break;
                case 2:
                    this.wordReg.single = new RegExp(/\[(.*?)\]/);
                    this.wordReg.all = new RegExp(/\[(.*?)\]/, 'g');
                    break;
                case 3:
                    this.wordReg.single = new RegExp(/\((.*?)\)/);
                    this.wordReg.all = new RegExp(/\((.*?)\)/, 'g');
                    break;
                default:
                    break;
            }
        },
        // 生成词包首尾字符
        _generateWordChar() {
            let firstStr;
            let endStr;
            switch (this.wordType) {
                case 1:
                    firstStr = "{";
                    endStr = "}";
                    break;
                case 2:
                    firstStr = "[";
                    endStr = "]";
                    break;
                case 3:
                    firstStr = "(";
                    endStr = ")";
                    break;
                default:
                    break;
            }
            return {
                firstStr, endStr
            }
        },
        // 生成词包展示Map
        _generateWordMap() {
            if (this.wordMapCache && JSON.stringify(this.wordMapCache) !== "{}") {
                return
            }
            const tmp = {}
            if (this.wordList && this.wordList.length) {
                this.wordList.forEach(item => {
                    const key = this._generateWordLabel(item[this.wordSetting.label]);
                    if (!tmp[key]) {
                        tmp[key] = item
                    }
                })
            }
            this.wordMapCache = tmp;
        },
        /**
         * 匹配词包
         * @returns {RegExpMatchArray} [词包1,词包2]
         * @private
         */
        _matchWord() {
            return this.inputVal.match(this.wordReg.all);
        },
        /**
         * 匹配词包位置生成缓存
         * @param words 待匹配的词包
         * @returns {[]} cache对应字段
         * @private
         */
        _findWordIndex(words) {
            let wordList = words;
            if (!words) {
                wordList = this._matchWord();
            }
            let copyStr = this.inputVal;
            const res = [];
            if (wordList && wordList.length) {
                wordList.forEach(str => {
                    const wordItem = this.wordMapCache[str];
                    const index = copyStr.indexOf(str);
                    if (index > -1 && wordItem) {
                        res.push({
                            start: index,
                            end: str.length - 1 + index,
                            label: wordItem[this.wordSetting.label],
                            value: wordItem[this.wordSetting.key]
                        })
                        copyStr = copyStr.replace(str, new Array(str.length).fill(".").join(""))
                    }
                })
            }
            return res;
        },
        /**
         * 光标是否在词包中
         * @param wordList 当前已有词包
         * @param curPosition 当前光标位置
         * @private
         */
        _isInWord(wordList, curPosition) {
            const res = {
                flag: false
            }
            // 单独光标
            if (curPosition[0] === curPosition[1]) {
                if (wordList && wordList.length) {
                    const tmp = wordList.filter(item => {
                        return item.start < curPosition[0] && item.end >= curPosition[0]
                    });
                    if (tmp && tmp.length > 0) {
                        res.flag = true;
                        res.data = tmp;
                    }
                }
            } else {
                if (wordList && wordList.length) {
                    const tmp = wordList.filter(item => {
                        return item.start <= curPosition[0] && item.end >= curPosition[1]
                    });
                    if (tmp && tmp.length > 0) {
                        res.flag = true;
                        res.data = tmp;
                    }
                }
            }
            return res;
        },
        /**
         * 字符串位置内是否包含词包
         * @param oriStr 字符串
         * @param start 开始位置
         * @param end 截止位置
         * @private boolean
         */
        _isContainWord(oriStr, start, end) {
            const wordChar = this._generateWordChar();
            const tmpStr = oriStr.slice(start, end);
            if (tmpStr.indexOf(wordChar.firstStr) > -1 || tmpStr.indexOf(wordChar.endStr) > -1) {
                return true;
            }
            return false;
        },
        /**
         * 光标是否在此包后面
         * @param wordList 已选词包
         * @param curPosition 当前光标
         * @private boolean
         */
        _isAfterWord(wordList, curPosition) {
            const res = {
                flag: false
            }
            if (curPosition[0] === 0) {
                return res;
            }
            const tmp = wordList.filter(item => {
                return item.end === curPosition[0] - 1;
            });
            if (tmp && tmp.length) {
                res.flag = true;
                res.data = tmp;
            }
            return res;
        },
        // --------------------校验相关---------------------
        /**
         * 校验输入长度
         * @returns {boolean} 是否通过校验
         * @private
         */
        _validLength() {
            if (this.inputLength > this.maxLen || this.inputLength < this.minLen) {
                return {
                    pass: false,
                    message: `请输入正确的${this.setting.label},长度应为${this.minLen}-${this.maxLen}个字`
                }
            }
            return {
                pass: true
            };
        },
        /**
         * 校验特殊字符(非词包)
         * @private
         */
        _validSpecialWord() {
            let tmp = [];
            let flag = true;
            const firstEndChar = this._generateWordChar();
            if (firstEndChar.firstStr && firstEndChar.endStr) {
                for (let i = 0; i < this.inputVal.length; i++) {
                    if (this.inputVal[i] === firstEndChar.firstStr) {
                        if (tmp.length === 0) {
                            tmp.push(i)
                        } else {
                            flag = false;
                            break;
                        }
                    }
                    if (this.inputVal[i] === firstEndChar.endStr) {
                        if (tmp.length === 1) {
                            tmp.pop()
                        } else {
                            flag = false;
                            break;
                        }
                    }
                }
            }
            if (flag && tmp.length === 0) {
                return {
                    pass: true
                }
            } else {
                return {
                    pass: false,
                    message: `关键词通配符标识${firstEndChar.firstStr}##${firstEndChar.endStr}和动态词包标识${firstEndChar.firstStr}${firstEndChar.endStr}不允许作为标题内容出现`
                }
            }
        },
        /**
         * 校验正确的词包(是否在词包中)
         * @private
         */
        _validCorrectWord() {
            const tmp = this._matchWord();
            if (tmp && tmp.length) {
                const emptyWords = tmp.filter(item => {
                    return item.length === 2
                });
                if (emptyWords && emptyWords.length) {
                    const firstEndChar = this._generateWordChar();
                    return {
                        pass: false,
                        message: `关键词通配符标识${firstEndChar.firstStr}##${firstEndChar.endStr}和动态词包标识${firstEndChar.firstStr}${firstEndChar.endStr}不允许作为标题内容出现`
                    }
                }

                const wordList = this._findWordIndex(tmp);
                if (wordList) {
                    if (wordList.length < tmp.length) {
                        return {
                            pass: false,
                            message: `输入的动态词包不存在`
                        }
                    }
                    if (wordList.length > this.maxWordCount) {
                        return {
                            pass: false,
                            message: `最多插入${this.maxWordCount}个词包`
                        }
                    }
                }
            }
            return {
                pass: true
            };
        },


    },
    created() {
        this._generateWordMap();
        this._generateWordRegxp();
    }
};
