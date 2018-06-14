
import React, { Component } from 'react'



//筛选tab名
// filter_id  由filter_id决定数据如何转换
const filterIdArr = [
    "号码",//0
    "混合",//1
    "大小",//2
    "单双",//3
    "冠亚军和",//4
    "龙虎",//5
    "总和/龙虎",//6
    "总和"//7
];

const unitW=["万","千","百","拾","个"];
const num=["一","二","三","四","五","六","七","八","九","十"];
const filterMap =new Map([
    [0,{//PK拾
        id:[17,26],
        name:[0,2,3,4,5],
        tableHead:[
            num,
            num,
            num,
            ["冠亚军和","冠亚军大小","冠亚军单双"],
            ["龙位","虎位","龙","虎"],
        ],
        isBig:10

    }],
    [1,{//11选5
        id:[2,5,6,7,16],
        name:[0,1],
        tableHead:[
            unitW,
            ["定单双","猜中位"]
        ]

    }],
    [2,{//福彩3D
        id:[9],
        name:[0],
        tableHead:[
            ["百","十","个"],
            ["?","?","?"]
        ]
    }],
    [3,{//快三
        id:[12,13,19],
        name:[0,2,3,7],
        tableHead:[
            ["百","十","个"],
            ["百","十","个"],
            ["百","十","个"],
            ["总和","大小","单双"]
        ],
        isBig:6
    }],
    [4,{//六合彩
        id:[21,25],
        name:[0,1],
        tableHead:[
            ["一","二","三","四","五","六","特"],
            ["特码","特肖","单双","大小","波段","总和"]
        ]
    }],
    [5,{//扑克3
        id:[14],
        name:[0,1],
        tableHead:[
            ["一","二","三","形态"],
            ["散牌","同花","顺子","同花顺","豹子","对子"]
        ]
    }],
    [6,{//体彩P3P5
        id:[10],
        name:[0,1],
        tableHead:[
            ["一","二","三","四","五"],
            ["总和","大小","单双"]
        ],
        isBig:6
    }],
    [7,{//时时彩
        id:[1,4,8,11,18,24],
        name:[0,2,3,6],
        tableHead:[
            unitW,
            unitW,
            unitW,
            ["总和","大小","单双","龙虎"]
        ],
        isBig:9
    }],
    [8,{//双色球
        id:[22],
        name:[0],
        tableHead:[
            ["一","二","三","四","五","六","七"],
            ["?","?","?"]
        ]
    }],
    [9,{//幸运28
        id:[23],
        name:[0,1],
        tableHead:[
            ["一","二","三","和"],
            ["大小","单双","极值","波色","豹子"],
        ],
        isBig:9
    }]
]);


//获取彩种类型
function getLotteryCode(data){
    let code =data.code;
    let returnData = [];
    //处理开奖号码
    if(/[shdc]/.test(code)){
        //第一种 poker
        returnData = code.split(" ")
    }else if(/[" "]/.test(code)){
        // 第二种
        returnData = code.split(" ")
    }else{
        // 第三种
        returnData = code.split("")
    }
    //处理奖期
    let count =data.count.split("-")[1];
    if(!count){
        count=data.count;
    }
    returnData.unshift(count);
    return returnData;
}

//通过彩种id获取Filter筛选
export  function GetFilter(id) {
    //彩种对应分类

    for (let [index,item] of filterMap){

        if(item.id.indexOf(id) !== -1){
            let indexArr = item.name;
            let nameArr =[];
            for(let i=0,j=indexArr.length;i<j;i++){
                nameArr.push(filterIdArr[indexArr[i]])
            }
            return  {
                index:indexArr,//filter_id数组
                name:nameArr,//filter_name数组
                tableHead:item.tableHead,//filter_name数组
                filterMapId:index  //filterMap的id方面取值转换数据
            }
        }
    }

}

//初始化数据
export function InitDate(data) {
    let randerDate=[];
    data.map(function (item) {
        randerDate.push(getLotteryCode(item));
    });
    return randerDate
}
//转换数据
//filterId//filterId
// "号码",//0
// "混合",//1
//"大小",//2
//"单双",//3
//"冠亚军和",//4
//"1-5龙虎",//5
//"总和/龙虎"//6
export function TranslateData(filterId,filterMapId,data,lottery_id) {
    //深拷贝
    let newData = JSON.parse(JSON.stringify(data));
    switch(filterId) {
        case 0://号码   默认

            if(filterMapId === 4){
                newData.forEach(function (item,i) {
                    item.forEach(function (num,j) {
                        if(j>0){
                            newData[i][j]=LhcGetColor(num);
                        }
                    })
                });
            }else if(filterMapId === 5){
                newData = pokerTrans(newData);
                break;
            }else if(filterMapId === 9){//幸运28
                newData.forEach(function (item,i) {
                    let count=0;
                    item.forEach(function (num,j) {
                        if(j>0){
                            count +=parseInt(num);
                        }
                    });
                    item.push(count)
                });
                break;
            }
            break;
        case 1://混合
            newData = mixing(lottery_id,filterMapId,data);
            break;
        case 2: //大小
            newData.forEach(function (item,i) {
                item.forEach(function (num,j) {
                    if(j>0){
                        newData[i][j]=isBig(num,filterMapId);
                    }
                })
            });
            break;
        case 3://单双
            newData.forEach(function (item,i) {
                item.forEach(function (num,j) {
                    if(j>0){
                        newData[i][j]=isEven(num);
                    }
                })
            });
            break;
        case 4://冠亚军和
            newData = GJYH(newData);
            break;
        case 5://龙虎
            newData = LH(newData);
            break;
        case 6://总和龙虎
            newData = ZHLH(newData,filterMapId);
            break;
        case 7://总和
            newData = ZH(newData,filterMapId);
            break;
        default:
    }
    return newData
}

function isEven(num,prefix="") {

    if(num%2 ===1){
        return <span className="cell-even">{prefix}单</span>
    }else{
        return <span className="cell-odd">{prefix}双</span>
    }
}


function isBig(num,filterMapId,countIsBig,prefix) {

    if(countIsBig ==undefined){
        if(num > filterMap.get(filterMapId).isBig/2){
            return <span className="cell-big">{prefix}大</span>
        }else{
            return  <span className="cell-small">{prefix}小</span>
        }
    }else{
        if(num > countIsBig/2){
            return  <span className="cell-big">{prefix}大</span>
        }else{
            return  <span className="cell-small">{prefix}小</span>
        }
    }
}

//总和龙虎
function ZHLH(data,filterMapId) {
    let newData=[];
    let immediateArr=[];
    let countIsBig =filterMap.get(filterMapId).isBig * parseInt(data[0].length-1);//最大值，用于总和比大小
    let isDragonArr = [];
    //计算总数count
    data.forEach(function (item,i) {
        newData.push([]);
        let count=0;
        item.forEach(function (num,j) {
            if(j>0){
                count+=parseInt(num);
            }else{
                newData[i].push(num);
            }
        });
        immediateArr.push(count);
        isDragonArr.push(isDragon(item[1],item[5]))

    });
    immediateArr.forEach(function (item,i) {
        newData[i].push(item);
        newData[i].push(isBig(item,"",countIsBig,"总"));
        newData[i].push(isEven(item,"总"));
        newData[i].push(isDragonArr[i]);
    });
    return newData;

}
//判断龙虎(loseOrWin为true，则返回输赢)
function isDragon(pre,after,loseOrWin) {
    if(loseOrWin){
        if(pre>after){
            return <span className="cell-dragon">赢</span>
        }else if(pre === after){
            return "和"
        }else{
            return <span className="cell-tiger">输</span>
        }
    }else{
        if(pre>after){
            return <span className="cell-dragon">龙</span>
        }else if(pre === after){
            return "和"
        }else{
            return <span className="cell-tiger">虎</span>
        }
    }

}
//冠军亚和
function GJYH(data) {
    let newData=[];
    let immediateArr = [];
    //计算总数count
    data.forEach(function (item,i) {
        newData.push([]);

        let count=parseInt(item[1])+parseInt(item[2]);
        newData[i].push(item[0]);
        newData[i].push(count);
        newData[i].push(isBig(count,"",20));
        newData[i].push(isEven(count));

    });

    return newData
}
//龙虎"
function LH(data) {
    let newData=[];
    data.forEach(function (item,i) {
        newData.push([]);
        newData[i].push(item[0]);
        newData[i].push(item[1]);
        newData[i].push(item[10]);

        newData[i].push(isDragon(item[1],item[10],true));

        newData[i].push(isDragon(item[10],item[1],true));
    });
    return newData
}

//总和
function ZH(data,filterMapId) {
    let newData=[];
    let immediateArr=[];
    let countIsBig =filterMap.get(filterMapId).isBig * parseInt(data[0].length-1);//最大值，用于总和比大小
    let isDragonArr = [];
    //计算总数count
    data.forEach(function (item,i) {
        newData.push([]);
        let count=0;
        item.forEach(function (num,j) {
            if(j>0){
                count+=parseInt(num);
            }else{
                newData[i].push(num);
            }
        });
        immediateArr.push(count);
        isDragonArr.push(isDragon(item[1],item[5]))

    });
    immediateArr.forEach(function (item,i) {
        newData[i].push(item);
        newData[i].push(isBig(item,"",countIsBig,"总"));
        newData[i].push(isEven(item,"总"));
    });
    return newData;

}
//混合
//id 彩种id
function mixing(id,filterMapId,data){
    if(data.length===0){
        return data 
    }
    let currentIndex = 0;
    let newData = [];
    let immediateArr=[];
    let countIsBig =filterMap.get(filterMapId).isBig * parseInt(data[0].length-1);//最大值，用于总和比大小

    for(let [index,item] of filterMap){
        if(item.id.indexOf(id)!==-1){
            currentIndex=index;//currentIndex判断彩种类型
        }
    }
    //计算总数count
    data.forEach(function (item,i) {
        newData.push([]);
        let count=0;
        item.forEach(function (num,j) {
            if(j>0){
                count+=parseInt(num);
            }else{
                newData[i].push(num);
            }
        });
        immediateArr.push(count);
    });
    if(currentIndex === 1){ //11选5
        data.forEach(function (item,i) {
            //定单双
            let count = 0;
            let newArr = JSON.parse(JSON.stringify(item));
            function sortNumber(a,b)
            {
                return a - b
            }
            item.forEach(function (item,j) {

                if(j>0&&parseInt(item)%2===1){
                    count++;
                }
            });
            newData[i].push(count+"单"+(5-count)+"双");
            newData[i].push(newArr.sort(sortNumber)[2])
        })
    }else if(currentIndex===3){//快三
        newData.forEach(function (item,i) {
            newData[i].push(isEven(immediateArr[i],"总"));
            newData[i].push(isBig(immediateArr[i],"",countIsBig,"总"));

            newData[i].push(immediateArr[i]);

        })
    }else if(currentIndex===4){//六合彩
        data.forEach(function (item,i) {
            let temai =parseInt(item[7]);
            newData[i].push(LhcGetColor(temai));

            let count=0;
            item.forEach(function (num,j) {
                if(j>0){
                    count+=parseInt(num);
                }
            });
            newData[i].push(getshengxiao(item[7],item[0].substr(0,4)));
            newData[i].push(isEven(temai,"特"));
            newData[i].push(isBig(temai,"",49,"特"));
            newData[i].push(getBoDuan(temai));
            newData[i].push(count);
        })
    }else if(currentIndex===5){//扑克

        data.forEach(function (item,i) {
            let Pattern = pokerPattern(item[1],item[2],item[3]);
            if(Pattern.length===0){
                newData[i].push(<span className="cell-red">散牌</span>);
                newData[i][2]="-";
                newData[i][3]="-";
                newData[i][4]="-";
                newData[i][5]="-";
                newData[i][6]="-";
            }else{
                newData[i][1]="-";
                if(Pattern.indexOf("同花") !==-1){
                    newData[i][2]=<span className="cell-blue">同花</span>;
                }else{
                    newData[i][2]="-";
                }
                if(Pattern.indexOf("顺子") !==-1){
                    newData[i][3]=<span className="cell-green">顺子</span>;
                }else{
                    newData[i][3]="-";
                }
                if(Pattern.length===2){
                    newData[i][4]=<span className="cell-pink">同花顺</span>;
                }else{
                    newData[i][4]="-";
                }
                if(Pattern.indexOf("豹子") !==-1){
                    newData[i][5]=<span className="cell-orange">豹子</span>;
                }else{
                    newData[i][5]="-";
                }
                if(Pattern.indexOf("对子") !==-1){
                    newData[i][6]=<span className="cell-orange">对子</span>;
                }else{
                    newData[i][6]="-";
                }
            }



        })
    }else if(currentIndex===6){//体彩p3p5
        data.forEach(function (item,i) {
            newData[i].push(immediateArr[i]);
            newData[i].push(isEven(immediateArr[i],"总"));
            newData[i].push(isBig(immediateArr[i],"",countIsBig,"总"));

        });

    }else if(currentIndex===9){//幸运28
        data.forEach(function (item,i) {
            newData[i].push(isBig(immediateArr[i],"",27,"总"));
            newData[i].push(isEven(immediateArr[i],"总"));
            newData[i].push(isExtremum(immediateArr[i]));
            newData[i].push(xy28Sebo(immediateArr[i]));
            if(pokerPattern(item[1],item[2],item[3]).indexOf("豹子") !==-1){
                newData[i].push("豹子");
            }else{
                newData[i].push("-");
            }
        });
    }else if(currentIndex === 8){

    }else if(currentIndex === 2){

    }

    return newData;
}

//获取生肖 参数 （特肖 num）（year 当前年份）
function getshengxiao(num,year){
    let index = parseInt(year)-2017;
    let ShengXiao=['鸡','猴','羊','马','蛇','龙','兔','虎','牛','鼠','猪','狗'];

    if(index !==0){
        for (let i=0;i<index;i++){
            ShengXiao.unshift(ShengXiao[11]);
            ShengXiao.length=12;
        }
    }
    let data =ShengXiao[(num-1)%12];
    return (<span className="cell-red">{data}</span>)
}


//六合彩获得颜色 参数 号码 num
export  function LhcGetColor(num) {
    let redBo =[1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46]
    let blueBo =[3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48 ]
    // let greenBo =[5,6,11,16,17,21,22,27,28,32,33,38,39,43,44,49]

    if(redBo.indexOf(parseInt(num)) !== -1){
        return(<span className="cell-red">{num}</span>)
    }else if(blueBo.indexOf(parseInt(num)) !== -1){
        return(<span className="cell-blue">{num}</span>)
    }else{
        return(<span className="cell-green">{num}</span>)
    }

}
//波段 num 号码
function getBoDuan(num){
    let redBo =[1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46];
    let blueBo =[3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48 ];
    // let greenBo =[5,6,11,16,17,21,22,27,28,32,33,38,39,43,44,49]

    if(redBo.indexOf(parseInt(num)) !== -1){
        return(<span className="cell-red">红波</span>)
    }else if(blueBo.indexOf(parseInt(num)) !== -1){
        return(<span className="cell-blue">蓝波</span>)
    }else{
        return(<span className="cell-green">绿波</span>)
    }
}

function pokerTrans(data) {
    let newData=[];
    data.map(function (item,i) {
        newData.push([]);
        newData[i][0]= item[0];
        newData[i][1]= pokerColor(item[1]);
        newData[i][2]= pokerColor(item[2]);
        newData[i][3]= pokerColor(item[3]);
        //形态
        let Pattern = pokerPattern(item[1],item[2],item[3]);
        if(Pattern.length===0){
            newData[i][4]= <span className="cell-red">散牌</span>
        }else if(Pattern.length===2){
            newData[i][4]= <span className="cell-pink">同花顺</span>;
        }else if(Pattern.indexOf("顺子") !==-1){
            newData[i][4]= <span className="cell-green">{Pattern[0]}</span>
        }else if(Pattern.indexOf("同花") !==-1){
            newData[i][4]= <span className="cell-blue">{Pattern[0]}</span>
        }else if(Pattern.indexOf("豹子") !==-1){
            newData[i][4]= <span className="cell-orange">{Pattern[0]}</span>
        }else if(Pattern.indexOf("对子") !==-1){
            newData[i][4]= <span className="cell-orange">{Pattern[0]}</span>
        }
    });
    return newData
}
function pokerColor(pokerNum) {
    let arr=["s","h","c","d"];//桃心梅方
    let arrZN=["黑桃","红心","梅花","方块"];//桃心梅方
    let index = arr.indexOf(pokerNum.split("")[1]);
    let num =pokerNum.split("")[0]==="T"?10:pokerNum.split("")[0];
    return <span className={"cell-poker-"+index}>{arrZN[index] + num}</span>
}
//扑克形态   ["散牌","同花","顺子","同花顺","豹子","对子"]
function pokerPattern(num1,num2,num3) {
    //花色

    let colorSet =new Set([num1.split("")[1],num2.split("")[1],num3.split("")[1]]);
    let numSet =new Set([num1.split("")[0],num2.split("")[0],num3.split("")[0]]);
    let normal =["A","2","3","4","5","6","7","8","9","T","J","Q","K","A"];
    let Pattern=[];//形态
    if(colorSet.size===1){
        Pattern.push("同花")
    }
    if(numSet.size===1){
        Pattern.push("豹子")
    }else if(numSet.size===2){
        Pattern.push("对子")
    }else{
        if(numSet.has(normal[11]) && numSet.has(normal[12]) && numSet.has(normal[13])){//减少3次遍历
            Pattern.push("顺子");
        }else{
            for(let i=0,j=normal.length-3;i<j;i++){
                if(numSet.has(normal[i]) && numSet.has(normal[i+1]) && numSet.has(normal[i+2])){
                    Pattern.push("顺子");
                    i=j;
                }
            }
        }
    }
    return Pattern;

}

function isExtremum(num){
    if(num<5){
        return "极小"
    }else if(num<23){
        return "-"
    }else{
        return "极大"
    }
}
// 红波（三个数值和）：03,06,09,12,15,18,21,24为红波。
// 绿波（三个数值和）：01,04,07,10,16,19,22,25为绿波。
// 蓝波（三个数值和）：02,05,08,11,17,20,23,26为蓝波。
function xy28Sebo(num) {
    let redBo =[3,6,9,12,15,18,21,24];
    let greenBo =[1,4,7,10,16,19,22,25 ];
    let blueBo =[2,5,8,11,17,20,23,26]

    if(redBo.indexOf(parseInt(num)) !== -1){
        return(<span className="cell-red">红波</span>)
    }else if(greenBo.indexOf(parseInt(num)) !== -1){
        return(<span className="cell-green">绿波</span>)
    }else if(blueBo.indexOf(parseInt(num)) !== -1){
        return(<span className="cell-blue">蓝波</span>)
    }else{
        return("-")
    }
}