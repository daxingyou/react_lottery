import React, { Component } from 'react'
//彩球显示
// 传参   data = data
// data={
//     lottery_id:"彩票lottery_id",
//     code:"开奖号码",
//     kTime:"休市判断"//0或者数字或者不传，不传即不判断休市
// }
export default class LotteryNum extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount(){

    }

    // Code有4种
    // 第一种 “55555”  一个数字一个号
    // 第二种 “01 02 03 04 05” 空格分割
    // 第三种 “2s 5h 8d”
    getLotteryCode(){
        let code = this.props.data.code;
        if(/[shdc]/.test(code)){
            //第一种 poker
            return {
                codeArr:code.split(" "),
                type:"poker"
            }
        }else if([12,13,19].indexOf(parseInt(this.props.data.lottery_id)) !==-1){
            // 第二种 骰子
            return {
                codeArr:code.split(""),
                type:"sifter"
            }
        }else if(/[" "]/.test(code)){

               return {
                   codeArr:code.split(" "),
                   type:"normal"
               }


        }else{
            // 第四种 普通
            return {
                codeArr:code.split(""),
                type:"normal"
            }
        }
    }
    renderDate(){
        let codeObj = this.getLotteryCode();
        let render="";
        //休市判断
        if(this.props.data.kTime!==undefined&&this.props.data.kTime!==0){
            render = <span className="closed">
                休市中...
            </span>
        }else if(this.props.data.code==""){
            if(this.props.data.lottery_id=="15"){
                render="即买即开"
            }else{
                render = <p className="winning">
                    正在开奖...
                </p>
            }
        }else{
            let arr = codeObj.codeArr;
            let itemArr = [];

            if (codeObj.type.indexOf("normal") !==-1){
                let _this = this;
                arr.map(function (item,index) {
                    itemArr.push(<li key={index} className={_this.trans(item)}>{item}</li>)
                });
                render = <ul className={codeObj.type}>
                    {itemArr}
                </ul>
            }else if(codeObj.type=="sifter"){//骰子
                arr.map(function (item,index) {
                    itemArr.push(<i key={index} className={"icon-sifter icon-sifter-"+item}></i>)
                });
                render = <div className="sifter">
                    {itemArr}
                </div>
            }else{//扑克
                arr.map(function (item,index) {
                    itemArr.push(<i key={index} className={"poker-icon poker-"+item}></i>)
                });
                render = <div className="poker">
                    {itemArr}
                </div>
            }

        }
        return render;
    }
    trans(num){
        let id= parseInt(this.props.data.lottery_id)||parseInt(this.props.id);
        if(id===21||id===25){//六合彩
            let redBo =[1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46];
            let blueBo =[3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48 ];
            if(redBo.indexOf(parseInt(num)) !== -1){
                return("cell-red")
            }else if(blueBo.indexOf(parseInt(num)) !== -1){
                return("cell-blue")
            }else{
                return("cell-green")
            }
        }else if(id===22){//双色球
            return("cell-ssq")
        }else if(id===17){//pk10
            return "pk-"+num
        }else if(id===26){//xyft
            return "xy-"+num
        }
    }
    render() {
        return (
           <div>
               {this.renderDate()}
           </div>
        )
    }

}
