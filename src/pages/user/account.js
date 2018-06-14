import React, {Component} from 'react';
import {Link} from 'react-router';
import { message} from 'antd';

import Navbar from '../common/navbar';
import Api from '../api';
import ReactDOM from 'react-dom';
import { PullToRefresh, DatePicker, List } from 'antd-mobile';
import 'antd-mobile/lib/pull-to-refresh/style/css';//加载选择样式
export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      total: 0,
      totalMount: 0,
      show: false,
      filter: [],
      date: '',//筛选日期
      nowDate: null,//当前日期
      maxDate: null,//最大可选日期
      key: '',//筛选类型
      height: document.documentElement.clientHeight,//下拉刷新判断
      down:true,
      page:1,
      startY:0,
      refreshing:false,
    }
  }

  componentDidMount() {
      this.getDate();//获取当前日期
      this.getData();
      this.getType()//获取类型
      this.getDown()
    setTimeout(() => this.setState({
      height: ReactDOM.findDOMNode(document.getElementsByClassName("account")[0]).offsetHeight
    }), 0);
  }
  
  getDate() {
    const nowTimeStamp = Date.now();
    const now = new Date(nowTimeStamp);
    this.setState({
      nowDate: now,
      maxDate: now,
    })
  }

  hideSel() {
    this.setState({
      show: false,
    })
  }

  handleCancel() {
    this.setState({
      visible: false,
      showdate: false
    });
  }
  //获取当天日期的值
  onOk(value) {
    let newdate;
    if (value === undefined) {
      //获取今天日期
      let currentTime = new Date();
      let currentYear = currentTime.getFullYear();
      let currentMonth = currentTime.getMonth() < 10 ? '0' + currentTime.getMonth() + 1 : currentTime.getMonth() + 1;
      let currentDate = currentTime.getDate() < 10 ? '0' + currentTime.getDate() : currentTime.getDate();
      newdate = `${currentYear}-${currentMonth}-${currentDate}`;
    } else {
      //获取插件日期
      let date = value;
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let curmonth = month < 10 ? '0' + month : month;
      let day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate();
      newdate = `${year}-${curmonth}-${day}`;
    }
    this.setState({
      visible: false,
      date: newdate,
      nowDate: value,
      showdate: false,
    }, () => {
      this.getData();
    })
  }
  componentWillUnmount() {
    document.getElementsByClassName('account')[0].removeEventListener('touchstart', (ev) => {
      let startY = ev.changedTouches[0].pageY;
      this.setState({
        startY:startY
      })

    }, true);
    document.getElementsByClassName('account')[0].removeEventListener('touchend', (ev) => {
      let endY = ev.changedTouches[0].pageY;
      let direction = endY - this.state.startY;
      if(direction===0){
        return false;
      }else if(direction>0){
        this.setState({
          down:true
        })
      }else{
        this.setState({
          down:false
        })
      }


    }, true);
    }
  getDown(){
    //滑动处理
      document.getElementsByClassName('account')[0].addEventListener('touchstart',(ev)=> {

          let startY = ev.changedTouches[0].pageY;
          this.setState({
              startY:startY
          })

    }, true);

      document.getElementsByClassName('account')[0].addEventListener('touchend',(ev)=> {

            let endY = ev.changedTouches[0].pageY;
            let direction = endY - this.state.startY;
            if(direction===0){
                return false;
            }else if(direction>0){
                this.setState({
                    down:true
                })
            }else{
                this.setState({
                    down:false
                })
            }


    }, true);
  }
  getData() {
    let data = JSON.parse(sessionStorage.getItem("user"));
    let param = "";
    if (this.state.date) {
      param += "&date=" + this.state.date;
    }
    if (this.state.key) {
      param += "&orderType=" + this.state.key;
    }
    if(this.state.page){
      param+="&page"+this.state.page;
    }
    Api("c=fin&a=orderList" + "&user_id=" + data.user_id + param, null, (data) => {
      let status = data.errno;
      if (status === 0) {
        let showData = data.data.showDatas ? data.data.showDatas : [];
        if (showData.length === 0) {
          let newdata = [];
          newdata.push(
            <li key={0} className="noData">
							<span>
                没有相关消息
              </span>
            </li>);
          this.setState({
            data: newdata,
          });
        } else {
          let newdata = [];
          showData.map(function (item, i) {
            newdata.push(
              <li key={i}>
                <span className="span_time">
                  {item.create_time.substr(0, 10)}
                  <p>{item.create_time.substr(-8)}</p>
                </span>
                <span className="span_middle">
                  {item.type}
                </span>
                <span className="fr span_amount">
                    ￥{parseFloat(item.amount).toFixed(3)}
                </span>
              </li>)
          });
          this.setState({
            data:newdata,
          });
        }
      } else {
        message.error(" '查询数据异常信息' + error",2)
      }
      setTimeout(() => {
        this.setState({ refreshing: false });
      }, 1000);
    })
  }

  loadMore(){
    let nextpage=this.state.page+1;
    this.setState({
      page:nextpage,
    });
    let data = JSON.parse(sessionStorage.getItem("user"));
    let param = "";
    if (this.state.date) {
      param += "&date=" + this.state.date;
    }
    if (this.state.key) {
      param += "&orderType=" + this.state.key;
    }
    if(this.state.page){
      param+="&page="+this.state.page;
    }
    Api("c=fin&a=orderList" + "&user_id=" + data.user_id + param, null, (data) => {
      let status = data.errno;
      if (status === 0) {
        let showData = data.data.showDatas ? data.data.showDatas : [];
        if (showData.length === 0) {
          message.warning("没有更多的数据",1);
          setTimeout(() => {this.setState({refreshing: false});
          }, 1000);
        } else {
          let newdata = [];
          showData.map(function (item, i) {
            newdata.push(
              <li key={i}>
                <span className="span_time">
                  {item.create_time.substr(0, 10)}
                  <p>{item.create_time.substr(-8)}</p>
                </span>
                <span className="span_middle">
                  {item.type}
                </span>
                <span className="fr span_amount">
                  ￥{parseFloat(item.amount).toFixed(3)}
                </span>
              </li>)
          });

          this.setState({
            data: new Set([...this.state.data,newdata]),
          });
        }
      } else {
        message.error(" '查询数据异常信息' + error",2)
      }
      setTimeout(() => {
        this.setState({ refreshing: false });
      }, 1000);
    })
  }
  reLoad(){
    this.setState({
      // data:[],
      page:1,
    });
    this.getData();
  }
  //	类型增加一个下拉列表
  showType() {
    this.setState({show: !this.state.show});
  }

  getType() {
    let data = JSON.parse(sessionStorage.getItem("user"));
    let user_id = data.user_id;
    Api("c=default&a=getType&user_id=" + user_id, null, (res) => {
      let data = res.data;
      this.setState({
        filter: data
      })
    })
  }

  //根据类型查数据
  filterType(key) {
    this.setState({
      key: key,
      show: !this.state.show
    }, () => {
      this.getData();

    });
  }

  //隐藏
  hideLotteryType() {
    this.setState({show: false});
  }




  render() {
    let typeArr = [];
    typeArr.push(<li key={""} onClick={() => {
      this.filterType()
    }}>全部</li>);
    this.state.filter.map((item, i) => {
      typeArr.push(
        <li key={i} className={item.key === this.state.key ? "active" : ""} onClick={() => {
          this.filterType(item.key)
        }}>{item.val}</li>
      )
    });
    let navbarRight = <div className="datepicker-wrapper">
        <List className="date-picker-list" style={{backgroundColor: 'white'}} onClick={() => {
          this.hideSel()
        }}>
            <DatePicker
              mode="date"
              title="请选择日期"
              value={this.state.nowDate}
              maxDate={this.state.maxDate}
              onChange={date => this.setState({date})}
              onDismiss={() => {
                this.handleCancel()
              }}
              onOk={(value) => {
                this.onOk(value)
              }}
            >
                <List.Item arrow="horizontal">查询日期</List.Item>
            </DatePicker>
        </List>
    </div>
    return (
      <div>
          <Navbar title="个人账变" back="back" navbarRight={navbarRight}/>
          <div className="accountnav">
              <ul>
                  <li>
                      <Link>
                          <span>账变时间</span>
                      </Link>
                      <Link>
                                <span className="accountType" onClick={() => {
                                  this.showType()
                                }}>类型</span>
                      </Link>
                      <Link>
                          <span>账变金额</span>
                      </Link>
                  </li>
              </ul>

            {/*帐变类型*/}
              <ul className="type" style={{display: this.state.show ? 'block' : 'none'}}>
                {typeArr}
              </ul>
          </div>


          <div className="account" onClick={() => {this.hideSel()}}>
            {/*遮罩层*/}
              <div className="box" style={{display: this.state.show ? 'block' : 'none'}} onClick={() => {this.hideLotteryType()}}>

              </div>

              <PullToRefresh
                ref={el => this.ptr = el}
                style={{
                  height:this.state.height,
                  overflow: 'auto',
                }}
                indicator={this.state.down ? {
                  activate: '松开立即刷新',
                  deactivate: '下拉刷新',
                  finish:" "
                } : {activate: '松开立即加载', deactivate: '上拉加载更多',finish:" "}}
                direction={this.state.down ? 'down' : 'up'}
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.setState({ refreshing: true });
                  this.state.down?this.reLoad():this.loadMore();

                }}
              >
                  <ul className="account-content">
                    {this.state.data}
                  </ul>
              </PullToRefresh>
          </div>
      </div>
    );
  }
}
