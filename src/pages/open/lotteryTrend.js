import React, { Component } from 'react'
import Navbar from '../common/navbar';
import { Tabs } from 'antd-mobile';
import {GetFilter,InitDate,TranslateData} from './trendmap';
import LotteryNameMap from '../lottery_name_map';
import ReactDOM from 'react-dom';
import { Icon } from 'antd';

import Api from '../api';

export default class LotteryTrend extends Component {
    constructor(props) {
        super(props);
        this.state={
            id:props.location.query.id-0,//转number
            title:"",
            data:[],//请求得到的所有数据
            filter:{},//
            initData:{},
            tabs:[],//tab内容名称
            tabIndex:0,//tab切换index,
            renderTableHead:[],
            renderTableBody:[],
            lotteryArr:[]
        }
    }
    componentWillMount(){
        this.getHistory();
        this.getLotteryList();
    }
    //获取数据
    getHistory(id=this.state.id){
        Api("c=default&a=getOpen&lottery_id="+id,null,(res)=>{
            let openIssues = res.data.openIssues;
            if(!openIssues){
                openIssues=[];
            }
            let data=[];
            openIssues.map(function (item,i) {
                data.push({
                    count:item.issue,//奖期
                    code:item.code//中奖号码
                })
            });
            if(this.state.tabs.length>0){

            }
            //得到数据转化数据
            let initData = InitDate(data);
            let filter = GetFilter(id);
            let transData = TranslateData(filter.index[0],filter.filterMapId,initData,id);
            this.setState({
                initData : initData,
                filter:filter,
                title:LotteryNameMap(id),
                //渲染tab
                tabs:this.setTabs(filter.name),
                //渲染Head
                renderTableHead : this.renderTableHead(filter.tableHead),
                //渲染body
                renderTableBody : this.renderTableBody(transData)
            });
        })
    }
    getLotteryList(){
        if(sessionStorage.getItem("lotteryArr")){
            this.setState({
                lotteryArr:JSON.parse(sessionStorage.getItem("lotteryArr"))
            })
        }else{
            Api("c=default&a=welcome",null,(res)=>{

                let lotteryList=res.data.lotteryList
                let lotteryArr =[];
                lotteryList.map((item,i)=>{
                    lotteryArr.push([item.lottery_id,item.cname])
                });
                this.setState({
                    lotteryArr:lotteryArr
                });
                sessionStorage.setItem("lotteryArr",JSON.stringify(lotteryArr))
            })
        }

    }
    setTabs(name){
        let tabs=[];
        name.forEach(function (item, i) {
            tabs.push({
                title:item
            })
        });
        return tabs;

    }
    //渲染table 头部
    renderTableHead(indexArr,index=0){
        let data = indexArr[index];
        let rander=[];
        data.map(function (item,i) {
            rander.push(<b key={i}>{item}</b>)
        });
        return rander;
    }
    //渲染table 内容
    renderTableBody(data){
        let rander=[];
        data.forEach(function (item,i) {
            let randerInner = [];
            item.forEach(function (item,k){
                randerInner.push(
                    <label key={k}>{item}</label>
                )
            });
            rander.push(
                <div className="trend-table-tr" key={i}>
                    {randerInner}
                </div>
            )
        });
        return rander;
    }
    //切换时
    changeTabs(index){
        let filterId =this.state.filter.index[index];
        let transData = TranslateData(filterId,this.state.filter.filterMapId,this.state.initData,this.state.id);
        this.setState({
            renderTableHead : this.renderTableHead(this.state.filter.tableHead,index),
            renderTableBody :this.renderTableBody(transData)
        })
    }



    change(index){
        this.setState({
            id:index,
            tabIndex:0
        },function () {
            this.getHistory();//获取历史之后初始化tab（通过点击）
            ReactDOM.findDOMNode(document.getElementsByClassName("am-tabs-default-bar-tab")[0]).click();
        })

    }

    render() {
    let renderMenu;

    if(this.state.lotteryArr.length>0){
        renderMenu = new Map(this.state.lotteryArr);

    }else{
        renderMenu= new Map([]);
    }
    let className;
    if([9,22].indexOf(this.state.id) !==-1){
        className = "nohead"
    }
        return(
            <div>
                <Navbar
                    title={<span>{this.state.title}<Icon type="caret-down" /></span>}
                    back={"back"}
                    change={(index)=>{this.change(index)}}
                    dropdown = {renderMenu}
                    id={this.state.id}
                />
                {JSON.stringify(renderMenu)}
                <div className={"lottery-trend-wrap "+className}>
                    <Tabs ref="myInput" tabs={this.state.tabs} animated={false} useOnPan={false} onChange={(tab, index) => { this.changeTabs(index)}}>
                        <div>
                            <div className="trend-table-tr trend-table-head">
                                <b>期号</b>
                                {this.state.renderTableHead}
                            </div>
                            <div className="trend-table-body">
                                {this.state.renderTableBody}
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
        )
    }
}
