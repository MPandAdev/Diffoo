const {version,name:Name} = require('../../package.json')
/**
 * 日志类
 *
 * @export
 * @class Logger
 */
export class Logger {
    /**
     * 是否开启debug
     *
     * @type {boolean}
     * @memberof Logger
     */
    isDebug:boolean;
    constructor(debug:boolean = false){
        this.isDebug = debug;
    }
    /**
     * 标记
     *
     * @type {string}
     * @memberof Logger
     */
    marker: string = `[${Name}-${version}]`;
    log(...args: any[]) {
        if(this.isDebug){
            console.log(this.marker,...args);
        }
    }
    info(...args: any[]) {
        if(this.isDebug){
            console.info(this.marker,...args);
        }
    }
    warn(...args: any[]) {
        if(this.isDebug){
            console.warn(this.marker,...args);
        }
    }
    error(...args: any[]) {
        if(this.isDebug){
            console.error(this.marker,...args);
        }
    }
    debug(...args: any[]) {
        if(this.isDebug){
            console.debug(this.marker,...args);
        }
    }
    parse(...args: any[]) {
        return args.map(arg=>{
            if(null === arg || undefined === arg){
                return arg;
            }
            if(typeof arg === 'object'){
                return arg
            }
            return arg;
        })
    }
}