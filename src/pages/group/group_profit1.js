import React,{Component,PropTypes} from 'react';
import Navbar from '../common/navbar';
import Api from '../api';
import {message } from 'antd';
import {DatePicker,List,PullToRefresh} from 'antd-mobile';
import ReactDOM from 'react-dom';

export default class Group_profit1 extends Component{
  constructor(props){
    super(props);
    super(props);
    this.state = {
    ModalText:'HELLO',
    visible: false,
    confirmLoading: false,
    myDate:"",//初始化日期
    activityList:[],//向后台请求返回的数据
    totalCommission:0,//返佣总金额
    totalWin:0,//盈亏总金额
    hasContent:true,
    nowDate:null,
    maxDate:null,
    refreshing: false,//下拉加载更多
    down: true,//下拉加载更多
    height: document.documentElement.clientHeight,//下拉加载更多
    page:1,//下拉加载更多
    totalpage:1,//下拉加载更多
  }
  }

 //下面方法用于转换日期字符串格式
 check(str){
        str=str.toString();
        if(str.length<2){
            str='0'+ str;
        }
        return str;
    }

 //下面方法用于转换日期字符串格式
 format(date,str){
        var mat={};
        mat.M=date.getMonth()+1;//月份记得加1
        mat.H=date.getHours();
        mat.s=date.getSeconds();
        mat.m=date.getMinutes();
        mat.Y=date.getFullYear();
        mat.D=date.getDate();
        mat.d=date.getDay();//星期几
        mat.d=this.check(mat.d);
        mat.H=this.check(mat.H);
        mat.M=this.check(mat.M);
        mat.D=this.check(mat.D);
        mat.s=this.check(mat.s);
        mat.m=this.check(mat.m);
        if(str.indexOf(":")>-1){
            mat.Y=mat.Y.toString().substr(2,2);
            return mat.Y+"/"+mat.M+"/"+mat.D+" "+mat.H+":"+mat.m+":"+mat.s;
        }
        if(str.indexOf("/")>-1){
            return mat.Y+"/"+mat.M+"/"+mat.D+" "+mat.H+"/"+mat.m+"/"+mat.s;
        }
        if(str.indexOf("-")>-1){
            return mat.Y+"-"+mat.M+"-"+mat.D;
        }
    }

 //从日期选择表里提取所选日期，date为所选日期
 onChange(date){
        let myDate=this.format(date,'YYYY-MM-DD');
        this.setState({
            myDate:myDate,
            nowDate:date,
            page:1,
            totalpage:1,
            activityList:[],
            totalCommission:0,
            totalWin:0,
            down: true
        },()=>{
            this.handleGetdataforoneday();
        })
    }

  getDate(){
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        this.setState({
            nowDate:now,
            maxDate:now,
        })
    }

  componentWillMount(){
    this.handleGetdata();
      this.getDate();
  }

  //上拉加载更多组件
  componentDidMount() {
        const hei =ReactDOM.findDOMNode(document.getElementsByClassName("showContent")[0]).offsetHeight;
        setTimeout(() => this.setState({
            height: hei,
        }), 0);
        this.changeDownStatus();
    }

  //获取后台数据
  handleGetdata(){
    let page="&page="+this.state.page;
    if(this.state.page>this.state.totalpage){
        message.info("没有更多数据");
        return;
    }else{
    Api("c=user&a=teamWinReport"+page,null,(res)=>{
        if(res.errno>0){
            message.info(res.errstr);
        }
        let activityList=res.data.other;//需要渲染到页面的数据
        let userList = res.data.self;  //当前登录用户的信息也需要显示
        let totalpage=res.data.totalPages;
        let totalPageCommission=0;//初始化每页返佣总金额
        let totalPageWin=0;//初始化每页盈亏总金额
        this.setState({
            totalpage:totalpage,
            page:this.state.page+1
        })
        if(activityList==""){
            activityList=[];
            totalPageCommission=0;
            totalPageWin=0;
        }else{
            totalPageCommission=Number((res.data.all_count.page_count.not_self.page_commission).toFixed(2));
            totalPageWin=Number((res.data.all_count.page_count.has_self.page_win).toFixed(2));
        };

        if(activityList.length===0){
            this.setState({
                hasContent:false
            })
        }else{
            this.setState({
                hasContent:true
            })
        }
        let totalCommission=Number((this.state.totalCommission+totalPageCommission).toFixed(2));
        let totalWin=Number((this.state.totalWin+totalPageWin).toFixed(2));

        let thisForActivityList=this;
        activityList.unshift(userList); //当前登录账户也需要显示并显示在第一个，unshift在数组的开头插入一个或多个元素
        activityList.map(function(item,i){
            thisForActivityList.state.activityList.push(item);
        });
        this.setState({
           totalCommission:totalCommission,
           totalWin:totalWin
        });
    })
   };
  }

  //获取后台一天数据
  handleGetdataforoneday(){
        let date="&date="+this.state.myDate;
        let page="&page="+this.state.page;
        if(this.state.page>this.state.totalpage){
            message.info("没有更多数据");
            return;
        }else{
            Api("c=user&a=teamWinReport"+date+page,null,(res)=>{
                if(res.errno>0){
                    message.info(res.errstr);
                }
                let activityList=res.data.other;//需要渲染到页面的数据
                let totalpage=res.data.totalPages;
                let totalPageCommission=0;//初始化每页返佣总金额
                let totalPageWin=0;//初始化每页盈亏总金额
                this.setState({
                    totalpage:totalpage,
                    page:this.state.page+1
                })
                if(activityList==""){
                    activityList=[];
                    totalPageCommission=0;
                    totalPageWin=0;
                }else{
                    totalPageCommission=Number((res.data.all_count.page_count.not_self.page_commission).toFixed(2));
                    totalPageWin=Number((res.data.all_count.page_count.not_self.page_win).toFixed(2));
                };

                if(activityList.length===0){
                    this.setState({
                        hasContent:false
                    })
                }else{
                    this.setState({
                        hasContent:true
                    })
                }
                let totalCommission=Number((this.state.totalCommission+totalPageCommission).toFixed(2));
                let totalWin=Number((this.state.totalWin+totalPageWin).toFixed(2));
                let thisForActivityList=this;
                activityList.map(function(item,i){
                    thisForActivityList.state.activityList.push(item);
                });
                this.setState({
                    totalCommission:totalCommission,
                    totalWin:totalWin
                });
            })
        };
    }

  //根据移动触摸事件更改down的布尔值
  changeDownStatus(){
        let content=document.getElementsByClassName("showContent")[0];
        let startY;
        content.addEventListener("touchstart",(e)=>{
            startY=e.changedTouches[0].pageY;
        },true);
        content.addEventListener("touchend",(e)=>{
            let endY=e.changedTouches[0].pageY;
            let direction=endY-startY;
            if(direction==0){
                return;
            }else if(direction>0){
                this.setState({
                    down:true
                })
            }else{
                this.setState({
                    down:false
                })
            }
        },true)
    }

  render(){
    let randerActivity=[];//显示在页面上的元素
    let lotteryActivity=this.state.activityList;//从后台获取的数据
    //把需要显示在页面上的元素PUSH到randerActivity
    if(!this.state.hasContent){
      randerActivity.push(
          <div key={0}>
            <ul className="teamprofitdetail">
              <li>无相关信息</li>
            </ul>
          </div>
      );
    }else{
    lotteryActivity.map(function(item,i){
        randerActivity.push(
            <div key={i}>
              <ul className="teamprofitdetail">
                <li>{item.username}</li>
                <li>{"￥"+item.total_commission}</li>
                <li>{"￥"+item.total_win}</li>
              </ul>
            </div>
        );
    })
    };
    return (
      <div>
        <Navbar title=" 团队盈亏报表" back="/group"/>
        <div>
            <div className="pickUpDate">
                <DatePicker
                    onChange={this.onChange.bind(this)}
                    mode="date"
                    title="请选择查询日期"
                    extra="选择日期"
                    value={this.state.nowDate}
                    maxDate={this.state.maxDate}
                >
                    <List.Item arrow="horizontal">查询日期</List.Item>
                </DatePicker>
            </div>
        </div>
        <div className="behindNavbar">
          <div>
            <ul className="teamprofitheader">
              <li>账户</li>
              <li>返佣</li>
              <li>实际盈亏</li>
            </ul>
          </div>
          <div className="showContent">
              <PullToRefresh
                  ref={el => this.ptr = el}
                  style={{
                      height: this.state.height,
                      overflow: 'auto',
                  }}
                  indicator={this.state.down? {} : { activate:'松开立即加载' }}
                  direction={this.state.down ? 'down' : 'up'}
                  refreshing={this.state.refreshing}
                  onRefresh={() => {
                      if(this.state.myDate){
                          if(this.state.down){
                              this.setState({
                                  page:1,
                                  totalpage:1,
                                  activityList:[],
                                  totalCommission:0,
                                  totalWin:0
                              })
                              this.handleGetdataforoneday();
                          }else{
                              this.handleGetdataforoneday();
                          }
                      }else{
                          if(this.state.down){
                              this.setState({
                                  page:1,
                                  totalpage:1,
                                  activityList:[],
                                  totalCommission:0,
                                  totalWin:0
                              })
                              this.handleGetdata();
                          }else{
                              this.handleGetdata();
                          }
                      };
                      this.setState({ refreshing: true });
                      setTimeout(() => {
                          this.setState({ refreshing: false });
                      }, 1000);
                  }}
              >
                  <div className="teamlist">
                    {randerActivity}
                  </div>
              </PullToRefresh>
          </div>
          <div>
              <ul className="countforprofit">
                  <li>合计:</li>
                  <li>返佣：
                      <span>￥{this.state.totalCommission}</span>
                  </li>
                  <li>实际盈亏：
                      <span>￥{this.state.totalWin}</span>
                  </li>
              </ul>
          </div>
        </div>
      </div>
    )
  }
}
