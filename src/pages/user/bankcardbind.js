import React, {Component} from 'react';
import Navbar from '../common/navbar';
import {hashHistory} from 'react-router';
import Api from '../api';
import {message} from 'antd';
import {List, InputItem, Picker} from 'antd-mobile';
import {createForm} from 'rc-form';
import 'antd-mobile/lib/input-item/style/css';//加载选择样式
import 'antd-mobile/lib/picker/style/css';//加载选择样式
class BankCardBindForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sValue: [],
        }
    }

    selectBank(id) {
        this.setState({sValue: id});
        this.props.selectBank(id);
    }

    format(values) {
        if (values.length > 0) {
            return values[0].props.children[1].props.children
        } else {
            return "选择银行"
        }
    }

    render() {
        return (
            <div>
                {/*防止填充表单 start*/}
                <input type="password" className="auto-complete-input"/>
                {/*防止填充表单 end*/}
                <List>
                    <InputItem
                        // type="bankCard"
                        type="number"
                        placeholder="储蓄卡"
                        clear
                        moneyKeyboardAlign="left"
                        id="bankNum"
                    >卡号</InputItem>
                </List>
                <List className="picker-list">
                    <Picker
                        data={this.props.list}
                        title="银行列表"
                        format={(values) => {
                            return this.format(values);
                        }}
                        cols="1"
                        value={this.state.sValue}
                        onChange={(id) => {
                            this.selectBank(id)
                        }}
                    >
                        <List.Item arrow="horizontal">银行</List.Item>
                    </Picker>
                </List>
                <List>
                    <InputItem
                        id="bankBranch"
                        type="text"
                        placeholder="请填写银行支行名称"
                        clear
                    >支行名称</InputItem>
                </List>
                <List>
                    <InputItem
                        id="bankName"
                        type="text"
                        placeholder="持卡人姓名"
                        clear
                    >姓名</InputItem>
                </List>
                <List>
                    <InputItem
                        id="secpwd"
                        type="password"
                        placeholder="资金密码"
                        clear
                    >资金密码</InputItem>
                </List>
            </div>
        );
    }
}

export default class BankCardBind extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],//银行列表
            bind_bank_id: ""
        }
    }

    selectBank(bank_id) {
        this.setState({
            bind_bank_id: bank_id[0]
        })
    }

    shouldComponentUpdate() {
        if (this.state.list.length > 0) {
            return false
        } else {
            return true
        }
    }

    componentWillMount() {
        this.getBankList();
    }

    getBankList() {
        let user = JSON.parse(sessionStorage.getItem("user"));
        Api("c=fin&a=bindCard&user_id=" + user.user_id + "&is_wap=1", null, (res) => {
            let list = res.data.banklist;
            let newList = [];
            list.map(function (item, i) {
                newList.push({
                    label:
                        <div><i className={"icon-bank icon-bank-" + item.bank_id}></i><span
                            className="bank-item">{item.bank_name}</span></div>, value: item.bank_id
                })
            });
            this.setState({
                list: newList
            });
        })
    }

    handleSubmit() {
        let bind_bank_id = this.state.bind_bank_id;
        let bind_card_num = document.getElementById("bankNum").value;
        let bind_bank_username = document.getElementById("bankName").value;
        let secpwd = document.getElementById("secpwd").value;
        let bankBranch =document.getElementById("bankBranch").value; //银行支行
        let data = JSON.parse(sessionStorage.getItem("user"));
        //验证卡号跟用户名
        let regCardnum = /^\d{16,19}$/g;
        let regbind_bank_username = /^[\u4e00-\u9fa5]*$/;
        //卡验证
        if (!bind_card_num) {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error("银行卡号不能为空(必须为16位数字或者19位数字)", 2);

            return false;
        } else if (!regCardnum.test(bind_card_num)) {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error("银行卡号必须为16位数字或者19位数字", 2);

            return false;
        } else if (!bind_bank_username) {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error("姓名不能为空(必须为中文)", 2);

            return false;
        } else if (!regbind_bank_username.test(bind_bank_username)) {
            //实现不累加显示，重复点击只显示一个
            message.config({
                top: 20,
                duration: 1,
            });
            message.error("姓名必须为中文", 2);
            return false;
        } else if (regbind_bank_username.test(bind_bank_username)) {
            Api("c=fin&a=bindCard", {
                user_id: data.user_id,
                bind_bank_id: bind_bank_id,
                bind_card_num: bind_card_num,
                bind_bank_username: bind_bank_username,
                secpwd: secpwd,
                branch_name: bankBranch
            }, (res) => {
                if (res.errno == 0) {

                    //实现不累加显示，重复点击只显示一个
                    message.config({
                        top: 20,
                        duration: 1,
                    });
                    message.success("您已经成功绑定银行卡", 2);

                    hashHistory.push("user_state");
                }
            });
            return true;
        }

    }

    render() {
        const BankCardBindFormWrapper = createForm()(BankCardBindForm);

        return (
            <div>
                <Navbar title="绑定银行卡" back="back"/>
                <div className="bank-card-bind-wrap">
                    <div className="form-wrap">
                        <BankCardBindFormWrapper list={this.state.list} selectBank={(bank_id) => {
                            this.selectBank(bank_id)
                        }}/>
                    </div>

                    <button className="submit-btn" onClick={this.handleSubmit.bind(this)}>确定</button>
                    <div className="bank-card-bind-warining">
                        <p className="red">温馨提示：</p>
                        <ol>
                            <li className="red"><span className="fl">1.银行卡绑定主要用于会员提现使用，最多可绑定1张银行卡。<br/>
                            如需解绑、请与在线客服联络。</span>
                            </li>
                            <li className="red"><span className="fl">2.请注意，一旦银行卡绑定不能修改、删除、请认真核对填写。</span></li>
                            <li className="red"><span className="fl">3.会员提现时，请选择需要提现到的已绑定银行卡，并仔细核对。</span></li>
                            <li className="red"><span className="fl">4.建议会员填写支行信息，以保证快速出款。</span></li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }
}
