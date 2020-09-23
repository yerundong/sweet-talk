/*
	utils 工具类公共方法
*/
const utils = {
	/**
	 * @method 深拷贝
	 * @param <object> json 目标对象
	 * @param <object> jsonCopy 拷贝对象
	 */
	deepClone(json, jsonCopy = {}) {
		try {
			return JSON.parse(JSON.stringify(json));
		} catch (error) {
			for (let i in json) {
				if (typeof json[i] == 'object') {
					jsonCopy[i] = (json[i].constructor === Array) ? [] : {};
					this.deepClone(json[i], jsonCopy[i]);
				} else {
					if (json.hasOwnProperty(i)) {
						jsonCopy[i] = json[i];
					}
				}
			}
			return jsonCopy;
		}
	},
	/**
	 * @method 判断数据类型
	 * @param <any> variable 数据
	 */
	getVariableType(variable){
		return (Object.prototype.toString.call(variable)).slice(8, -1);
	},
	/**
	 * @method 日期格式化
	 * @param <object> date 日期对象
	 */
	dateTimeFormat(date, symbol='-', includeTime=true){
		let year = date.getFullYear();
		let moth = this.doubleNumber(date.getMonth()+1);
		let day = this.doubleNumber(date.getDate());
		let hour,minute, second;
		if(includeTime){
			hour = this.doubleNumber(date.getHours());
			minute = this.doubleNumber(date.getMinutes());
			second = this.doubleNumber(date.getSeconds());
		}
		let reStr = `${year}${symbol}${moth}${symbol}${day}`
		if(includeTime){
			reStr += ` ${hour}:${minute}:${second}`;
		}
		return reStr;
	},
	/**
	 * @method 获取当日初始时间的日期对象（不包含时分秒）
	 * @param <object> date 日期对象
	 */
	getDateStart(date){
		let year = date.getFullYear();
		let moth = date.getMonth();
		let day = date.getDate();
		return new Date(year, moth, day)
	},
	/**
	 * @method 获取当月的始末日期
	 * @param <object> date 日期对象
	 */
	getMonthStartEnd(date){
		let year = date.getFullYear();
		let moth = date.getMonth();
		let start = new Date(year, moth, 1)
		let end = new Date(year, moth+1, 0, 23, 59, 59, 999)
		return [start, end]
	},
	/**
	 * @method 获取当月的始末日期
	 * @param <object> date 日期对象
	 */
	getMonthStartEndFormat(date, symbol='-', includeTime=true){
		let arr = this.getMonthStartEnd(date)
		return [this.dateTimeFormat(arr[0], symbol, includeTime), this.dateTimeFormat(arr[1], symbol, includeTime)]
	},
	/**
	 * @method 数字双位数化
	 * @param <number> number 
	 */
	doubleNumber(number){
		if(typeof number != 'number'){
			// throw Error('doubleNumber: 需要number类型');
			console.error('doubleNumber: 需要number类型')
			return
		}
		if(number<10 && number>=0){
			return '0' + number;
		}else{
			return number
		}
	},
	/**
	 * @method 数字单位格式化
	 * @param <object> option.cardinal 基数 默认['万', '千万', '亿']
	 * @param <object> option.decimal 保留小数 默认2位
	 * @param <object> option.onesNeedDecimal 个位是否保留小数 默认否
	 * @param <object> option.suffix 单位
	 */
	formatNumberUnit(value, option={}) {
		if(typeof value != 'number'){
			console.error('formatNumberUnit: 需要number类型')
			// throw new Error('formatNumberUnit: 需要number类型')
			return
		}
		let cardinalList = option.cardinalList || ['亿', '千万', '万', '个'];
		let decimal = option.decimal || 2;
		let suffix = option.suffix || '';
		let onesNeedDecimal = option.onesNeedDecimal || false;
		let unit = '';
		let cardinal = '';
		let reValue = '';
		let sign = value < 0 ? '-' : ''  // 保存符号位
		value = Math.abs(value)  // 取绝对值
		if(value == 0){
			reValue = 0;
		}else{
			for(let i=0,item;item = cardinalList[i];i++){
				if(item == '亿'){
					cardinal = 100000000;
				}else if(item == '千万'){
					cardinal = 10000000;
				}else if(item == '百万'){
					cardinal = 1000000;
				}else if(item == '十万'){
					cardinal = 100000;
				}else if(item == '万'){
					cardinal = 10000;
				}else if(item == '千'){
					cardinal = 1000;
				}else if(item == '百'){
					cardinal = 100;
				}else if(item == '个'){
					cardinal = 1;
				}
				if(value/cardinal >= 1){
					reValue = (value / cardinal).toFixed(decimal);
					if(item == '个'){
						unit = ''
						if(!onesNeedDecimal){
							reValue = value.toFixed(0);
						}
					}else{
						unit = item;
					}
					break;
				}
			}
		}
		return {
			value: sign+reValue, // 符号位 + 数值位
			unit: unit + suffix
		}
	},
}
