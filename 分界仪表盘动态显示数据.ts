interface ExceptionParamsList {
    paraName: string;
    numericalValue: number;
    expand: boolean;
    min: number;
    max: number;
    segmentation1: number;
    segmentation2: number;
    segmentation3: number;
    segmentation4: number;
    unit: string;
    name: string;
}


export class ParamMonitorComponent implements OnInit {
    chartOption: any;
    connection: HubConnection;
    // 每一次进入时将数组置空，以防数组中存储数量太多，累计显示到实时参数检测区。
    listOfData: ExceptionParamsList[] = [];

    expandSet = new Set<number>();


    // 构造函数（创建对象时初始化对象），建立连接，连接到服务器
    constructor() {
        this.connection = new HubConnectionBuilder()
            .withUrl(`${hubServerUrl}/RawParam`)
            .build();
    }

    async ngOnInit() {
        await this.connectToSignalRServer();
        // on事件函数没有返回值， =>{}后面写要对监听到的数据进行的操作
        this.connection.on('RawDataCome', (data: SensorInfo) => {
            this.listOfData = [];

            // Object.keys(data)是监听到的所有传感器参数的名称和数值。
            for (const key of ParamInfo) {
                // key是参数名，data[key]是参数值
                const limitation = LimitationDict[key] ?? [2, 5, 0.1, -5];
                // console.log(limitation);


                const info: ExceptionParamsList = {
                    paraName: key,
                    numericalValue: data[key],
                    expand: false,
                    //   仪表盘显示最小值
                    min: limitation.l2 - (limitation.h1 - limitation.l1) / 4,
                    //   仪表盘显示最大值
                    max: limitation.h2 + (limitation.h1 - limitation.l1) / 4,
                    //   仪表盘分界点
                    segmentation1: ((limitation.h1 - limitation.l1) / 4) / (limitation.h2 - limitation.l2 + (limitation.h1 - limitation.l1) / 2),
                    segmentation2: (limitation.l1 - limitation.l2 + (limitation.h1 - limitation.l1) / 4) / (limitation.h2 - limitation.l2 + (limitation.h1 - limitation.l1) / 2),
                    segmentation3: (limitation.h1 - limitation.l2 + (limitation.h1 - limitation.l1) / 4) / (limitation.h2 - limitation.l2 + (limitation.h1 - limitation.l1) / 2),
                    segmentation4: (limitation.h2 - limitation.l2 + (limitation.h1 - limitation.l1) / 4) / (limitation.h2 - limitation.l2 + (limitation.h1 - limitation.l1) / 2),
                    //   单位和名称
                    unit: SensorDict[key].unit,
                    name: SensorDict[key].name,
                };


                this.listOfData.push(info);
            }
            // console.log(this.listOfData[0])
            // 仪表盘样式
            this.chartOption = {
                series: [
                    // 左上角
                    {
                        name: '左上角',
                        type: 'gauge',
                        center: ['25%', '24%'],
                        min: this.listOfData[0].min, //比l2小一点
                        max: this.listOfData[0].max,  //比h2高一点
                        splitNumber: 10,
                        radius: '45%',
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[this.listOfData[0].segmentation1, '#ff0000'], [this.listOfData[0].segmentation2, '#FF6633'], [this.listOfData[0].segmentation3, '#005eff'], [this.listOfData[0].segmentation4, '#FF6633'], [1, '#ff0000']],
                                width: 5,
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8
                            }
                        },
                        axisLabel: {            // 坐标轴小标记
                            fontWeight: 'bolder',
                            color: '#fff',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 8
                        },
                        axisTick: {            // 坐标轴小标记
                            length: 12,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 18,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                width: 3,
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8
                            }
                        },
                        pointer: {           // 分隔线
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5
                        },
                        title: {
                            offsetCenter: [0, '30%'],
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize: 20,
                                fontStyle: 'italic',
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8,
                            }
                        },
                        detail: {
                            backgroundColor: 'rgba(30,144,255,0.8)',
                            borderWidth: 1,
                            borderColor: '#fff',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5,
                            offsetCenter: [0, '75%'],       // x, y，单位px
                            formatter: '{value}' + this.listOfData[0].unit,
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                color: '#fff',
                                fontSize: 20,
                            }
                        },
                        data: [{ value: this.listOfData[0].numericalValue, name: this.listOfData[0].name }]
                    },
                    // 右上角
                    {
                        name: '右上角',
                        type: 'gauge',
                        center: ['75%', '24%'],
                        min: this.listOfData[1].min, //比l2小一点
                        max: this.listOfData[1].max,  //比h2高一点
                        splitNumber: 10,
                        radius: '45%',
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[this.listOfData[1].segmentation1, '#ff0000'], [this.listOfData[1].segmentation2, '#FF6633'], [this.listOfData[1].segmentation3, '#005eff'], [this.listOfData[1].segmentation4, '#FF6633'], [1, '#ff0000']],
                                width: 5,
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8
                            }
                        },
                        axisLabel: {            // 坐标轴小标记
                            fontWeight: 'bolder',
                            color: '#fff',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 8
                        },
                        axisTick: {            // 坐标轴小标记
                            length: 12,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 18,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                width: 3,
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8
                            }
                        },
                        pointer: {           // 分隔线
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5
                        },
                        title: {
                            offsetCenter: [0, '30%'],
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize: 20,
                                fontStyle: 'italic',
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8,
                            }
                        },
                        detail: {
                            backgroundColor: 'rgba(30,144,255,0.8)',
                            borderWidth: 1,
                            borderColor: '#fff',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5,
                            offsetCenter: [0, '75%'],       // x, y，单位px
                            formatter: '{value}' + this.listOfData[1].unit,
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                color: '#fff',
                                fontSize: 20,
                            }
                        },
                        data: [{ value: this.listOfData[1].numericalValue, name: this.listOfData[1].name }]
                    },
                    // 左下角
                    {
                        name: '左下角',
                        type: 'gauge',
                        center: ['25%', '69%'],
                        min: this.listOfData[2].min, //比l2小一点
                        max: this.listOfData[2].min,  //比h2高一点
                        splitNumber: 10,
                        radius: '45%',
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[this.listOfData[2].segmentation1, '#ff0000'], [this.listOfData[2].segmentation2, '#FF6633'], [this.listOfData[2].segmentation3, '#005eff'], [this.listOfData[2].segmentation4, '#FF6633'], [1, '#ff0000']],
                                width: 5,
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8
                            }
                        },
                        axisLabel: {            // 坐标轴小标记
                            fontWeight: 'bolder',
                            color: '#fff',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 8
                        },
                        axisTick: {            // 坐标轴小标记
                            length: 12,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 18,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                width: 3,
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8
                            }
                        },
                        pointer: {           // 分隔线
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5
                        },
                        title: {
                            offsetCenter: [0, '30%'],
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize: 20,
                                fontStyle: 'italic',
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8,
                            }
                        },
                        detail: {
                            backgroundColor: 'rgba(30,144,255,0.8)',
                            borderWidth: 1,
                            borderColor: '#fff',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5,
                            offsetCenter: [0, '75%'],       // x, y，单位px
                            formatter: '{value}' + this.listOfData[2].unit,
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                color: '#fff',
                                fontSize: 20,
                            }
                        },
                        data: [{ value: this.listOfData[2].numericalValue, name: this.listOfData[2].name }]
                    },
                    // 右下角
                    {
                        name: '右下角',
                        type: 'gauge',
                        center: ['75%', '69%'],
                        min: this.listOfData[3].min, //比l2小一点
                        max: this.listOfData[3].max,  //比h2高一点
                        splitNumber: 10,
                        radius: '45%',
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[this.listOfData[3].segmentation1, '#ff0000'], [this.listOfData[3].segmentation2, '#FF6633'], [this.listOfData[3].segmentation3, '#005eff'], [this.listOfData[3].segmentation4, '#FF6633'], [1, '#ff0000']],
                                width: 5,
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8
                            }
                        },
                        axisLabel: {            // 坐标轴小标记
                            fontWeight: 'bolder',
                            color: '#fff',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 8
                        },
                        axisTick: {            // 坐标轴小标记
                            length: 12,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 18,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                width: 3,
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8
                            }
                        },
                        pointer: {           // 分隔线
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5
                        },
                        title: {
                            offsetCenter: [0, '30%'],
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize: 20,
                                fontStyle: 'italic',
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 8,
                            }
                        },
                        detail: {
                            backgroundColor: 'rgba(30,144,255,0.8)',
                            borderWidth: 1,
                            borderColor: '#fff',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5,
                            offsetCenter: [0, '75%'],       // x, y，单位px
                            formatter: '{value}' + this.listOfData[3].unit,
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                color: '#fff',
                                fontSize: 20,
                            }
                        },
                        data: [{ value: this.listOfData[3].numericalValue, name: this.listOfData[3].name }]
                    }
                ],
            }
        });

    }


    // 销毁，用于关闭后断开连接
    ngOnDestroy(): void {
        void this.connection.stop();
    }
    // 如果连接没有成功，每5s重新连接一次。
    async connectToSignalRServer() {
        try {
            await this.connection.start();
            console.log('SignalR Connected.');
        } catch (err) {
            console.log(err);
            setTimeout(this.connectToSignalRServer, 5000);
        }
    }

}