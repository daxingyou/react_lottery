import React, { Component} from 'react'
import {Link,hashHistory} from 'react-router';
import {Icon,Modal} from 'antd';
import {Carousel} from 'antd-mobile';
import Navbar from '../common/navbar';
import Footer from '../common/footer';
import Api from '../api';
import 'antd-mobile/lib/carousel/style/css';//加载选择样式
import PopularLottery from './popular_lottery';  //热门彩票
import TheLatestLottery from './The_latest_lottery'; //最新开奖
import config from '../config';

import { pieOption, barOption, lineOption} from '../Echarts/options'
import PieReact from "../Echarts/PieReact"
import BarReact from "../Echarts/BarReact"
import LineReact from "../Echarts/LineReact"



export default class Home extends Component {
    constructor(props) {
        super(props);
        this.changePath = this.changePath.bind(this);
        let user = sessionStorage.getItem("user");
        this.state = {
            user:user,
            series_number: '---',
            lottery_number: ['-', '-', '-', '-', '-'],
            carouse_data:['','',''], //首页轮播图片
            echartCarousel:['','',''],
            Popular_lottery_data:[],//热门彩票
            TheColor_img:[], //彩种小图片
            latest_lotteryData:[],  //最新开奖
            announ_cement:[],   //首页公告
            myFavorite:[],//我的最爱
            disPlay:window.sessionStorage.myFavorite?'none':'block',//显示或者隐藏
            popularSetTime:null ,  //定时器序号
            visible:false,//弹窗
            isUnMount:false,//通过调用isUnMount（）判断组件是否被卸载
            title:"",//弹窗标题
            content:"",//弹窗内容
            welcomeDisplay:"",

        }
    };
    //弹窗
    info() {
        if(window.sessionStorage.visible==='false'){
            return
        }else{
            Api("c=default&a=welcome",null,(res)=>{
                let title=this.state.title;
                let content=this.state.content;
                let data=res.data.userAlert;
                let alllottery=[];
                for(let i=0;i<res.data.lotteryList.length;i++){
                    alllottery.push(res.data.lotteryList[i].lottery_id)
                }
                if(data.type=="image"){
                    Api("c=default&a=getAppAlert",null,(res)=>{
                        let welcome_page=res.data.welcome_page
                        let img=<img src={welcome_page}/>
                        if(res.data.is_use_wp==1){
                            this.setState({
                                content:img,
                                visible: true,
                                welcomeDisplay:true,
                            })
                        }else{
                            this.setState({
                                visible:false,
                                welcomeDisplay:false,
                            })
                        }
                    })
                }else{
                    title=<h2 className="info">{data.title}</h2>;
                    content=data.content;
                    if(data.title==null||data.content==null){
                        this.setState({
                            visible: false,
                        })
                    }else{
                        this.setState({
                            title:title,
                            visible: true,
                            content:content,
                        })
                    }
                }
                alllottery.sort((a,b)=>a-b);
                sessionStorage.setItem("alllottery",alllottery);
            })
        };
    };
    handleCancel (){
        this.setState({ visible: false });
    };
    changePath(lottery_id){
        let path = '';
        if([1, 4, 8,24,18,11].indexOf(lottery_id) !== -1) {
            path = 'ssc/' + lottery_id;
        } else if([2, 5, 6, 7,16].indexOf(lottery_id) !== -1) {
            path = '11x5/' + lottery_id;
        }else if([9].indexOf(lottery_id) !== -1) {
            path = 'fc3d/' + lottery_id;
        }else if([12,13,19].indexOf(lottery_id) !== -1) {
            path = 'k3/' + lottery_id;
        }else if([21,25].indexOf(lottery_id) !== -1) {
            path = 'lhc/' + lottery_id;
        } else if([14].indexOf(lottery_id) !== -1) {
            path = 'klpk/' + lottery_id;
        }else if([10].indexOf(lottery_id) !== -1) {
            path = 'p3p5/' + lottery_id;
        }else if([22].indexOf(lottery_id) !== -1) {
            path = 'ssq/' + lottery_id;
        }else if([23].indexOf(lottery_id) !== -1) {
            path = 'xy28/' + lottery_id;
        }else if([17].indexOf(lottery_id) !== -1) {
            path = 'pk10/' + lottery_id;
        }else if([26].indexOf(lottery_id) !== -1) {
            path = 'xyft/' + lottery_id;
        }else if([15].indexOf(lottery_id) !== -1){
            path = 'mmc/' + lottery_id;
        }
        else {
            path = 'hall';
        }
        return path
    }
    //我的最爱
    defaultLike(){
        let myFavorite=[1,2,7,9,12,16,17,26];//首页默认彩种;
        let lottery=[];
        let alllottery=sessionStorage.getItem("alllottery",alllottery);
        if(!alllottery){
            return null;
        }else{
            lottery = alllottery.split(",");
            for(let i=0;i<lottery.length;i++){
                lottery[i]=parseInt(lottery[i])
            }
        }
        for(let i=0;i<myFavorite.length;i++){
            let n=myFavorite[i];
            if(lottery.indexOf(n)==-1){
                myFavorite.splice(i,1);
            };
        }
        let str=[];
        for(var i=0;i<myFavorite.length;i++){
            str.push(
                <li key={i}>
                    <Link to={this.state.user?this.changePath(myFavorite[i]):"login"}>
                        <i className={"lt-icon lt-icon-"+myFavorite[i]}
                           data-name={myFavorite[i]}>
                        </i>
                    </Link>
                </li>
            )
        }
        return str
    }
    myLike(){
        let str=[];
        if(window.sessionStorage.myFavorite){
            var myFavorite=JSON.parse(window.sessionStorage.myFavorite);
            for(var i=0;i<myFavorite.length;i++){
                str.push(
                    <li key={i}>
                        <Link to={this.state.user?this.changePath(myFavorite[i]):"login"}>
                            <i className={"lt-icon lt-icon-"+myFavorite[i]}
                               data-name={myFavorite[i]}>
                            </i>
                        </Link>>
                    </li>
                )
                if(i==7){
                    return str
                }
            }
        }
        return str
    };
    componentWillMount(){
        this.info();
        //获取图表数据
        this.getEchart();
        this.PopularLotteryFun();
        this.LatestLottery();
        this.announcementFun();
    }
    withdrawMoney(){
        const user = JSON.parse(sessionStorage.getItem("user"));
        if(!user){
            hashHistory.push("login")
        }else{
            Api("c=user&a=info&user_id"+user.user_id,null,(res)=>{
                if(res.errno===0){
                    let data=res.data;
                    if(data.isset_secpwd!=1){
                        hashHistory.push("setpasswrod");
                    }else if(data.card_num==""){
                        hashHistory.push("bankCardBind");
                    }else{
                        hashHistory.push("withdrawMoney");
                    }
                }
            })
        }
    }

    //提现相关
    // checkMoney(){
    //   let user=JSON.parse(window.sessionStorage.user);
    // let isset_secpwd=user.isset_secpwd;
    // let path="";
    //   if(isset_secpwd){
    //      path="bankCardBind"
    //   }else{
    //      path="setpasswrod"
    //   }
    //   return path
    // }
    componentWillUnmount(){
        this.setState({
            isUnMount:true,
            echartCarousel:[]
        });
        if(this.state.popularSetTime){
            clearTimeout(this.state.popularSetTime);
        }

        sessionStorage.visible='false';
    }
    componentDidMount() {
        this.carouselFun();

    }
    isUnMount(){
        return this.state.isUnMount;
    }
    //获取图表数据
    getEchart(){
        Api('c=default&a=showDatas', null, (res) => {
            if(this.isUnMount()){//组件卸载判断
                return;
            }
            // deposits 存款金额
            // depositsType 存款类型
            // depositsAmount 存款金额分析 2万以上
            // withdraws 提现总额
            let echartCarousel=[];
            let xArr = [];
            let yArr = [];
            let newlineOption = JSON.parse(JSON.stringify(lineOption));
            {//存款类型饼图
                let depositsTypeArr= [];
                let depositsTypeOption = JSON.parse(JSON.stringify(pieOption));
                let depositsType = res.data.depositsType;
                let legend=[]
                depositsType.map(function (item,i) {
                    let data ={
                        value:parseInt(item.percentage),
                        name:item.info.substring(0,item.info.length-2)
                    };
                    legend.push(item.info.substring(0,item.info.length-2))
                    depositsTypeArr.push(data);
                });
                depositsTypeOption.series[0].data= depositsTypeArr;
                depositsTypeOption.legend.data=legend;

                //存款>2万条形图
                let depositsAmountX = ['2w以下','2w-5w','5w-10w','10w-15w','15w以上'];
                let depositsAmountY = [];
                let depositsAmountOption = JSON.parse(JSON.stringify(barOption));
                let depositsAmount = res.data.depositsAmount;

                depositsAmount.map(function (item,i) {
                    depositsAmountY.push(parseFloat(item.percentage));
                });

                depositsAmountOption.xAxis[0].data=depositsAmountX;
                depositsAmountOption.series[0].data=depositsAmountY;
                depositsAmountOption.yAxis[0].show=false;
                depositsAmountOption.series[0].itemStyle.normal.color=function(params) {
                    var colorList = ['#bfcecc','#f18a29','#e0157f','#cc8e2f','#34b4d9'];
                    return colorList[params.dataIndex]
                };
                depositsAmountOption.title.text="{title|当前存款总额比(%)}";
                depositsAmountOption.grid.bottom="10%";
                depositsAmountOption.xAxis[0].axisLabel= {
                    interval:0,
                    rotate: 30,
                    textStyle:{
                        fontSize:8
                    }
                };

                echartCarousel.push(<div key={4}>
                    <div className="echart-half">
                        <PieReact  height='160px' width='100%' option={depositsTypeOption}/>
                    </div>
                    <div className="echart-half">
                        <BarReact height='160px' width='100%' option={depositsAmountOption}/>
                    </div>


                </div>);
            }

            {
                //提现条形图
                let withdrawsX = [];
                let withdrawsY = [];
                let withdrawsOption = JSON.parse(JSON.stringify(barOption));
                let withdraws = res.data.withdraws;
                let WithdrawsAmount =0;
                withdraws.map(function (item,i) {
                    withdrawsX.push(item.create_time.substr(-5).replace("-","/"));
                    withdrawsY.push((parseInt(item.sum_amount)/10000).toFixed(2));
                    WithdrawsAmount += parseInt(item.sum_amount);
                });

                withdrawsOption.grid= {
                    show: false,
                    top:'40',
                    bottom:'40',
                    left: '60',
                    backgroundColor:'#fff',
                    containLabel: false
                };
                withdrawsOption.xAxis[0].data=withdrawsX;
                withdrawsOption.series[0].data=withdrawsY;
                WithdrawsAmount= parseInt(WithdrawsAmount/10000);
                withdrawsOption.title.text= "{title|提现总额：}{red| "+WithdrawsAmount+"万}";

                echartCarousel.push(<div key={2}><BarReact height='160px' option={withdrawsOption} key={2}/></div>);


            }

            // {
            //     //存款条形图
            //     let depositsX = [];
            //     let depositsY = [];
            //     let depositsOption = JSON.parse(JSON.stringify(barOption));
            //     let deposits = res.data.deposits;
            //     let depositsAmount =0;
            //     deposits.map(function (item,i) {
            //         depositsX.push(item.create_time.substr(-5).replace("-","/"));
            //         depositsY.push((parseInt(item.sum_amount)/10000).toFixed(2));
            //         depositsAmount += parseInt(item.sum_amount);
            //     });
            //     depositsOption.xAxis[0].data=depositsX;
            //     depositsOption.series[0].data=depositsY;
            //     depositsOption.series[0].name ="存款";
            //     depositsAmount= parseInt(depositsAmount/10000);
            //     depositsOption.title.text= "{title|存款总额：}{red| "+depositsAmount+"万}";
            //     depositsOption.color=['#fffd18'];
            //     echartCarousel.push(<div key={3}><BarReact height='160px' option={depositsOption} key={3}/></div>);
            //
            // }
            {
                //折线图
                let onLineUserNumber = res.data.onLineUserNumber;
                onLineUserNumber.map(function (item,i) {
                    xArr.push(item.date.substr(-5).replace("-","/"))
                    yArr.push(parseInt(item.number))
                });
                newlineOption.xAxis[0].data=xArr;
                newlineOption.series[0].data=yArr;
                newlineOption.title.text= "{title|当前在线人数：}{red| "+onLineUserNumber[onLineUserNumber.length-1].number+"人}"
                echartCarousel.push(<div key={1}><LineReact height='160px' option={newlineOption} /></div>);//在线人数

            }
            this.setState({
                echartCarousel:echartCarousel
            })

        });
    }
    /*首页图片轮播*/
    carouselFun(){
        Api("c=default&a=welcome",null,(res)=>{
            if(this.isUnMount()){//组件卸载判断
                return;
            }
            //轮播大图
            let data = res.data.bannerList;
            if(data){
                //用于热门彩票小图标展示
                let TheColorData  = res.data.lotteryList;

                if(this.isUnMount()){//组件卸载判断
                    return;
                }
                this.setState({
                    carouse_data:data,
                    TheColor_img:TheColorData
                })
            }


        })

    }



    /*热门彩票*/
    PopularLotteryFun(){
        Api("c=default&a=hotShow",null,(res)=>{
            let  data = res.data;
            //后台异常信息
            let error = res.errstr;
            //服务状态(0/成功)
            let status = res.errno;

            if(status>0){
                Modal.error({
                    title: '热门彩票'+error
                });
            }else{
                if(this.isUnMount()){//组件卸载判断
                    return;
                }
                this.setState({
                    Popular_lottery_data:data
                },function(){
                    this.hotlottery();
                })
            }
            this.setState({
                popularSetTime:setTimeout(()=>{
                    this.PopularLotteryFun()
                },60000),
            });
        })

    }

    hotlottery(){
        //热门彩票
        let  randerPopular = [];
        let  Popularlottery = this.state.Popular_lottery_data;
        let TheData = this.state.TheColor_img;
        for (var i=0;i<Popularlottery.length;i++){
            //热门彩票列表只显示三组
            if(i==4){

                break;
            }
            let data = Popularlottery[i];


            randerPopular.push(
                <PopularLottery PopularLotteryFun={()=>{this.PopularLotteryFun()}}  key={i} item={data}  data={TheData} changePath={this.changePath} />
            )

        }
        return randerPopular
    }




    /**最新开奖**/
    LatestLottery(){


        Api("c=default&a=newOpen",null,(res)=>{

            let  data = res.data;


            //后台异常信息
            let error = res.errstr;

            //服务状态(0/成功)
            let status = res.errno;

            if(status>0){
                Modal.error({
                    title: '最新开奖'+error
                });
            }else{
                if(this.isUnMount()){//组件卸载判断
                    return;
                }
                this.setState({
                    latest_lotteryData:data
                },function(){
                    this.latest();
                })
            }
        })
    }

    latest(){
        //最新开奖
        let  randerLatestLottery =[];

        let   LatestLotteryList = this.state.latest_lotteryData;

        for(var i=0;i<LatestLotteryList.length;i++){

            //只显示一组彩种
            if(i==1){
                break;
            }
            let list = LatestLotteryList[i];

            randerLatestLottery.push(
                <TheLatestLottery ref="theLatestLottery"  key={i} item={LatestLotteryList}/>
            )
        }

        return randerLatestLottery

    }




    /**首页公告**/
    announcementFun(){


        Api("c=default&a=noticeList",null,(res)=>{

            let  data = res.data;

            //后台异常信息
            let error = res.errstr;
            //服务状态(0/成功)
            let status = res.errno;

            if(status>0){

                Modal.error({
                    title: '公告异常'+error,
                });

            }else{
                if(this.isUnMount()){//组件卸载判断
                    return;
                }
                this.setState({
                    announ_cement:data
                },function(){
                    this.sign();
                })
            }
        })
    }


    sign(){
        let items="";
        let listMessage = this.state.announ_cement;
        if(listMessage) {
            for(let i=0;i<listMessage.length;i++){
                items += listMessage[i].title;
                items+="   ";
            }
        }else{
            items="暂时没有公告"
        }
        return <div className="noticeList">
            <i></i>
            <p>
                <span>{items}</span>
            </p>
        </div>
    }
    hideLatestLottery(){
        this.refs.theLatestLottery.showList("",false);
    }

    render() {

        return (
            <div onClick={()=>{this.hideLatestLottery()}}>
                <Modal
                    className={!this.state.welcomeDisplay?'welcome':""}
                    title={this.state.title}
                    visible={this.state.visible}
                    footer={null}
                    onOk={()=>{this.handleOk()}}
                    onCancel={()=>{this.handleCancel()}}
                    wrapClassName={this.state.welcomeDisplay?'welcome_page':""}
                >
                    {this.state.welcomeDisplay?this.state.content:<div className="info" dangerouslySetInnerHTML={{__html: this.state.content}} />}
                </Modal>
                <Navbar title={config.title} />
                <div className="home fadeInRight">
                    <div className="banner">
                        <Carousel
                            autoplay={true}
                            infinite={true}
                            selectedIndex={0}
                            dotStyle={{bottom:"5px"}}
                        >
                            {this.state.carouse_data.map((item,i) => (
                                <Link key={i} to={{pathname:'home/promodetail/'+item.id}}>
                                    <img src={item.image_path} />
                                </Link>
                            ))}
                        </Carousel>
                    </div>


                    <div className="marquee">
                        {this.sign()}
                    </div>

                    <section className="fast-link">

                        {this.state.user?<Link to="pay" className="btn-deposit"><i></i>充值</Link>:<Link to="login" className="btn-login"><i></i>登录</Link>}
                        {this.state.user?<a onClick={()=>{this.withdrawMoney()}} className="btn-withdrawal"><i></i>提现</a>:<Link to="Register" className="btn_registered"><i></i>注册</Link>}
                        <Link to={{pathname:"lotteryTrend",query:{id:1}}} className="btn-trend"><i></i>走势图</Link>
                        <Link  className="btn-service" to="getService"><i></i>在线客服</Link>
                    </section>

                    <section className="popular">
                        <h3>
                            <span>热门彩票</span>
                            <Link to="hall">更多<Icon type="right" /></Link>
                        </h3>

                        {this.hotlottery()}

                    </section>

                    <section className="latest">
                        <h3>
                            <span>最新开奖</span>
                        </h3>
                        {this.latest()}
                    </section>

                    <section className="favorite favorite2">
                        <h3>
                            <span>我的最爱</span>
                            <Link to="/mySetting"><i className="icon-setting"></i></Link>
                        </h3>
                        <div style={{display:this.state.disPlay}}>
                            <ul>
                                {this.defaultLike()}
                            </ul>
                        </div>
                        <ul>
                            {this.myLike()}
                        </ul>
                    </section>
                    <div>
                        <div className="echarts-wrap" >
                            <Carousel
                                autoplay={true}
                                infinite={true}
                            >
                                {this.state.echartCarousel.map((item,i) => (
                                    <div key={i}>
                                        {item}
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}
