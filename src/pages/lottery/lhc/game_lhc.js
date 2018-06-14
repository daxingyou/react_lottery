class GameLhc {
    constructor(props) {
        this.state = props;
    }

    factorial(n) {
        if (n <= 1) {
            return 1
        } else {
            return n * this.factorial(n - 1)
        }
    }

    /**
     * 提取issue的期号 By Davy
     * issue 有如下类型：20150403-001 20150615-01     2015040
     * 逻辑：有'-'的取其后所有字符,没有的取最后三位
     */
    getNumByIssue(issue) {
        if(issue.length == 0) {
            return false;
        }
        let pos = issue.indexOf("-");
        if (pos != -1) {
            return issue.substr(pos+1);
        } else {
            return issue.substr(issue.length-3);
        }
    }

    expandLotto($nums) {
        let result = [];
        let tempVars = [];
        let oneAreaIsEmpty = 0;
        $nums.map((v,k)=> {
            if (v == "") {
                oneAreaIsEmpty = 1;
                return
            }
            var tmp = v.split("_");
            tmp.sort();
            tempVars.push(tmp);
        })

        if (oneAreaIsEmpty) {
            return [];
        }
        for (let i = 0; i < $nums.length; i++) {
            let v = $nums[i];
            if (v == "") {
                oneAreaIsEmpty = 1;
                return;
            }
            let tmp = v.split("_");
            tmp.sort();
            tempVars.push(tmp);
        }
        if (oneAreaIsEmpty) {
            return [];
        }

        let i, j, k, L, m;
        switch ($nums.length) {
            case 2:
                for (let i = 0; i < tempVars[0].length; i++) {
                    for (j = 0; j < tempVars[1].length; j++) {
                        result.push(tempVars[0][i] + " " + tempVars[1][j]);
                    }
                }
                break;
            case 3:
                for (let i = 0; i < tempVars[0].length; i++) {
                    for (j = 0; j < tempVars[1].length; j++) {
                        for (k = 0; k < tempVars[2].length; k++) {
                            result.push(tempVars[0][i] + " " + tempVars[1][j] + " " + tempVars[2][k]);
                        }
                    }
                }
                break;
            case 5:
                for (let i = 0; i < tempVars[0].length; i++) {
                    for (j = 0; j < tempVars[1].length; j++) {
                        for (k = 0; k < tempVars[2].length; k++) {
                            for (L = 0; L < tempVars[3].length; L++) {
                                for (m = 0; m < tempVars[4].length; m++) {
                                    result.push(tempVars[0][i] + " " + tempVars[1][j] + " " + tempVars[2][k] + " " + tempVars[2][L] + " " + tempVars[2][m]);
                                }
                            }
                        }
                    }
                }
                break;
            default:
                throw "unkown expand";
                break;
        }
        let $finalResult = [];
        for (let i = 0; i < result.length; i++) {
            let $parts = result[i].split(" ");
            let tmp = array_unique($parts);
            if (tmp.length == $parts.length) {
                $finalResult.push(result[i]);
            }
        }
        return $finalResult;
    }

    //判断是否每区都有值
    allHasValue(cds) {
        var flag = 1, charsNum = 0;
        for (let i = 0; i < cds.length; i++) {
            charsNum += cds[i].length;
            if (cds[i].length == 0) {
                flag = 0;
            }
        }
        return {
            flag: flag,
            charsNum: charsNum
        };
    }

     isLegalCode (codes,mdCode) {

        //这一段加上否则直选和值类玩法不选号也能添加
        if (this.allHasValue(codes)['charsNum'] == 0) {
            return {
                singleNum: 0,
                isDup: 0
            };
        }

        var singleNum = 0,
            isDup = 0,
            parts;
        switch (mdCode) {
            case 'TMZX':
            case 'TMSX':
            case 'TMWS':
            case 'TMSB':
            case 'TMDXDS':
            case 'ZTYM':
            case 'ZTYX':
            case 'ZTWS':
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'ELX':
            case 'EZE':
                parts = codes[0].split('_');
                if (parts.length >= 2) {
                    singleNum = parts.length * (parts.length - 1) / 2;
                }

                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SLX':
            case 'SZS':
            case 'SZE':
                parts = codes[0].split('_');
                if (parts.length >= 3) {
                    singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / 6;
                }

                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SILX':
                parts = codes[0].split('_');
                if (parts.length >= 4) {
                    singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) / 24;
                }

                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SXZX': //三星直选 12,34,567
            case "ZSZX":
            case 'QSZX': //前三直选
                singleNum = codes[0].length * codes[1].length * codes[2].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SXZS': //三星组三
            case "ZSZS":
            case 'QSZS':
                singleNum = codes[0].length * (codes[0].length - 1);
                isDup = singleNum > 2 ? 1 : 0;
                break;
            case 'SXZL': //三星组六  1234
            case "ZSZL":
            case 'QSZL':
                singleNum = codes[0].length * (codes[0].length - 1) * (codes[0].length - 2) / helper.factorial(3);
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SXLX': //三星连选 12345,123,58
            case "ZSLX":
            case 'QSLX':
                //每区都必须有数字
                if (this.allHasValue(codes)['flag'] == 0) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }

                var $betNums3 = 0,
                    $betNums2 = 0,
                    $betNums1 = 0;
                //算注数 后三注数+后二注数+后一注数
                $betNums3 = codes[0].length * codes[1].length * codes[2].length;
                $betNums2 = codes[1].length * codes[2].length;
                $betNums1 = codes[2].length;
                singleNum = $betNums3 + $betNums2 + $betNums1;
                isDup = singleNum > 3 ? 1 : 0;
                break;
            case 'SXBD': //三星包点 一注可以有多个号码 不同号码之间要用_分隔 因为有大于9的结果
            case "ZSBD":
            case 'QSBD':
                parts = codes[0].split('_');
                $.each(parts, function(k, v) {
                    singleNum += helper.SXBD[v];
                });
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'SXHHZX': //三星混合组选 仅支持单式手工录入 12,34,567
            case "ZSHHZX":
            case 'QSHHZX': //前三混合组选 仅支持单式手工录入 12,34,567
                singleNum = codes[0].length * codes[1].length * codes[2].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'EXZX': //二星直选 0123456789,0123456789
            case 'QEZX':
                singleNum = codes[0].length * codes[1].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'EXZUX': //二星组选 0123456789
            case 'QEZUX':
                singleNum = codes[0].length * (codes[0].length - 1) / 2;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'EXLX': //二星连选 0123456789,0123456789
            case 'QELX':
                //每区都必须有数字
                if (this.allHasValue(codes)['flag'] == 0) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }

                //算注数 后二注数+后一注数
                var $betNums2 = 0,
                    $betNums1 = 0;
                $betNums2 = codes[0].length * codes[1].length;
                $betNums1 = codes[1].length;
                singleNum = $betNums2 + $betNums1;
                isDup = singleNum > 2 ? 1 : 0;
                break;
            case 'EXBD': //二星包点 一注可以有多个号码 不同号码之间要用_分隔 因为有大于9的结果
            case 'QEBD':
                parts = codes[0].split('_');
                $.each(parts, function(k, v) {
                    singleNum += helper.EXBD[v];
                });
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'YXZX': //一星直选
                singleNum = codes[0].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'WXDW': //五星定位
                var n = 4; //5!
                for (var i = 0; i < 5; i++) {
                    if (codes[i] != '-') {
                        singleNum += codes[i].length;
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SXDW': //低频特有 三星定位
                singleNum = codes[0].length + codes[1].length + codes[2].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'EMBDW': //三星二码不定位 一注仅限一组号码，如1,2，因为奖金本来就低，也为了判断方便
            case 'QSEMBDW': //新增前三二码
            case 'ZSEMBDW': //新增中三二码
            case 'SXEMBDW': //新增四星二码不定位
            case 'WXEMBDW': //新增五星二码不定位
                singleNum = codes[0].length * (codes[0].length - 1) / 2;
                isDup = 0;
                break;
            case 'WXSMBDW': //新增五星三码不定位
                singleNum = codes[0].length * (codes[0].length - 1) * (codes[0].length - 2) / 6;
                isDup = 0;
                break;
            case 'EXDXDS': //二星大小单双 一注仅限一个号码 因为奖金本来就低
            case 'QEDXDS': //低频3D特有 前二大小单双 一注仅限一个号码 因为奖金本来就低
                singleNum = codes[0].length * codes[1].length == 1 ? 1 : 0;
                isDup = 0;
                break;
            case 'SXDXDS': //三星大小单双 一注仅限一个号码 因为奖金本来就低
                singleNum = codes[0].length * codes[1].length * codes[2].length == 1 ? 1 : 0;
                isDup = 0;
                break;
            case 'YMBDW': //三星一码不定位 一注仅限一个号码，如1，因为奖金本来就低，也为了判断方便
            case 'ZSYMBDW': //新增中三一码不定位
            case 'SXYMBDW': //新增四星一码不定位
            case 'WXYMBDW': //新增五星一码不定位
            case 'QSYMBDW': //低频P3P5特有 前三一码不定位
                singleNum = codes[0].length;
                isDup = 0;
                break;
            case 'SXHZ': //三星和值 一注可以有多个号码 不同号码之间要用_分隔 因为有大于9的结果
            case "ZSHZ":
            case 'QSHZ':
                parts = codes[0].split('_');
                $.each(parts, function(k, v) {
                    singleNum += helper.SXHZ[v];
                });
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'EXHZ': //二星和值 一注可以有多个号码 不同号码之间要用_分隔 因为有大于9的结果
            case 'QEHZ':
                parts = codes[0].split('_');
                $.each(parts, function(k, v) {
                    singleNum += helper.EXHZ[v];
                });
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'SXZXHZ': //低频3D特有 组选和值
            case 'QSZXHZ': //低频P3P5特有 组选和值
                parts = codes[0].split('_');
                $.each(parts, function(k, v) {
                    singleNum += helper.SXZXHZ[v];
                });
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'SIXZX': //四星直选 12,34,567
            case 'QSIZX': //前四直选
                singleNum = codes[0].length * codes[1].length * codes[2].length * codes[3].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'WXZX': //五星直选
                //算注数 相乘即可
                singleNum = codes[0].length * codes[1].length * codes[2].length * codes[3].length * codes[4].length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'WXLX': //五星连选
                //每区都必须有数字
                if (this.allHasValue(codes)['flag'] == 0) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }

                var $betNums5 = 0,
                    $betNums3 = 0,
                    $betNums2 = 0,
                    $betNums1 = 0;
                //算注数 后三注数+后二注数+后一注数
                $betNums5 = codes[0].length * codes[1].length * codes[2].length * codes[3].length * codes[4].length;
                $betNums3 = codes[2].length * codes[3].length * codes[4].length;
                $betNums2 = codes[3].length * codes[4].length;
                $betNums1 = codes[4].length;
                singleNum = $betNums5 + $betNums3 + $betNums2 + $betNums1;
                isDup = singleNum > 4 ? 1 : 0;
                break;

            //========== sd11y ===========//
            case 'REZX': //任二直选
                var n = 4; //5!
                for (var i = 0; i < 4; i++) {
                    //如果注码不写'-'的话可以省略两个if判断,效率差不多
                    if (codes[i] != '-') {
                        for (var j = (i + 1); j < 5; j++) {
                            if (codes[j] != '-') {
                                singleNum += codes[i].length * codes[j].length;
                            }
                        }
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'RSZX': //任三直选  ["678", "67", "7", "7", "7"]
                for (var i = 0; i < 3; i++) {
                    if (codes[i] != '-') {
                        for (var j = (i + 1); j < 4; j++) {
                            if (codes[j] != '-') {
                                for (var k = (j + 1); k < 5; k++) {
                                    if (codes[k] != '-') {
                                        singleNum += codes[i].length * codes[j].length * codes[k].length;
                                    }
                                }
                            }
                        }
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'RSIZX': //任四直选["678", "67", "7", "7", "7"]
                for (var g = 0; g < 2; g++) {
                    if (codes[g] != '-') {
                        for (var i = (g + 1); i < 3; i++) {
                            if (codes[i] != '-') {
                                for (var j = (i + 1); j < 4; j++) {
                                    if (codes[j] != '-') {
                                        for (var k = (j + 1); k < 5; k++) {
                                            if (codes[k] != '-') {
                                                singleNum += codes[g].length * codes[i].length * codes[j].length * codes[k].length;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDQSZX': //前三直选 01_02_03_04,02_03,01_05
                if (codes.length != 3) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = helper.expandLotto(codes);
                singleNum = result.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDQEZX': //前二直选 二段 01_02_03_04,02_03
                if (codes.length != 2) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var result = helper.expandLotto(codes);

                singleNum = result.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDQSZUX': //前三组选 一段 01_02_03_04
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / helper.factorial(3);
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDQEZUX': //前二组选 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) / 2;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX1': //任选1 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX2': //任选2 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) / 2;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX3': //任选3 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / 6;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX4': //任选4 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) / 24;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX5': //任选5 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) * (parts.length - 4) / 120;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX6': //任选6 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) * (parts.length - 4) * (parts.length - 5) / 720;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX7': //任选7 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) * (parts.length - 4) * (parts.length - 5) * (parts.length - 6) / 5040;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDRX8': //任选8 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) * (parts.length - 3) * (parts.length - 4) * (parts.length - 5) * (parts.length - 6) * (parts.length - 7) / 40320;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDQSBDW': //前3不定位胆 一段 01_02_03_04_05_06_07_08_09_10_11
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'SDQSDWD': //前3定位胆 01_02_03,04_05,06_07为一单 也可以只买一位，如'01_02_03,,'表示只买个位胆，没买的位留空
                $.each(codes, function(k, v) {
                    if (v != '') {
                        //号码不得重复
                        parts = v.split('_');
                        singleNum += parts.length; //注意是数组长度，所以前面必须判断v != ''
                    }
                });
                isDup = singleNum > 3 ? 1 : 0;
                break;
            case 'SDDDS': //0单5双:750.0000元 (1注) 5单0双:125.0000元 (6注)1单4双:25.0000元 (30注)4单1双:10.0000元 (75注)2单3双:5.0000元 (150注)3单2双:3.7000元 (200注)
            case 'SDCZW': // 一次只能选一注
                singleNum = 1;
                isDup = 1;
                break;

            case 'YFFS': //趣味玩法,一帆风顺
            case 'HSCS': //趣味玩法,好事成双
            case 'SXBX': //趣味玩法,三星报喜
            case 'SJFC': //趣味玩法,四季发财
                singleNum = codes[0].length; //传来的数据模式 13567
                isDup = singleNum > 1 ? 1 : 0;
                break;

            case 'ZUX120': //组选120
                if (codes[0].length > 4) {
                    singleNum = codes[0].length === 5 ? 1 : (helper.factorial(codes[0].length) / (helper.factorial(codes[0].length - 5) * 120));
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'ZUX24': //组选24
                if (codes[0].length > 3) {
                    singleNum = helper.factorial(codes[0].length) / (helper.factorial(codes[0].length - 4) * 24);
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'ZUX6': //组选6
                if (codes[0].length > 1) {
                    singleNum = helper.factorial(codes[0].length) / (helper.factorial(codes[0].length - 2) * 2);
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;


            case 'ZUX10': //组选10
            case 'ZUX5': //组选5
            case 'ZUX4': //组选4
                if (codes[0].length > 0 && codes[1].length > 0) {
                    var compareNum = codes[1].length;
                    for (i = 0; i < codes[0].length; i++) {
                        var tmp = compareNum;
                        if (codes[1].indexOf(codes[0].substr(i, 1)) > -1) {
                            tmp = compareNum - 1;
                        }
                        if (tmp > 0) {
                            singleNum += helper.factorial(tmp) / helper.factorial(tmp - 1);
                        }
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;

            case 'ZUX20': //组选20
            case 'ZUX12': //组选12
                if (codes[0].length > 0 && codes[1].length > 1) {
                    var compareNum = codes[1].length;
                    for (i = 0; i < codes[0].length; i++) {
                        var tmp = compareNum;
                        if (codes[1].indexOf(codes[0].substr(i, 1)) > -1) {
                            tmp = compareNum - 1;
                        }
                        if (tmp > 1) {
                            singleNum += helper.factorial(tmp) / (helper.factorial(tmp - 2) * 2);
                        }
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;

            case 'ZUX60': //组选60
                if (codes[0].length > 0 && codes[1].length > 2) {
                    var compareNum = codes[1].length;
                    for (i = 0; i < codes[0].length; i++) {
                        var tmp = compareNum;
                        if (codes[1].indexOf(codes[0].substr(i, 1)) > -1) {
                            tmp = compareNum - 1;
                        }
                        if (tmp > 2) {
                            singleNum += helper.factorial(tmp) / (helper.factorial(tmp - 3) * 6);
                        }
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;

            case 'ZUX30': //组选30
                if (codes[0].length > 1 && codes[1].length > 0) {
                    var compareNum = codes[0].length;
                    for (i = 0; i < codes[1].length; i++) {
                        var tmp = compareNum;
                        if (codes[0].indexOf(codes[1].substr(i, 1)) > -1) {
                            tmp = compareNum - 1;
                        }
                        if (tmp > 1) {
                            singleNum += helper.factorial(tmp) / (helper.factorial(tmp - 2) * 2);
                        }
                    }
                }
                isDup = singleNum > 1 ? 1 : 0;
                break;

            //江苏快三
            case 'JSETDX': //二同单选 2个号区 11_22,34
                if (codes.length != 2) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }
                var parts0 = codes[0].length ? codes[0].split('_') : [];
                var parts1 = codes[1].length ? codes[1].split('') : [];
                singleNum = parts0.length * parts1.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'JSETFX': //二同复选 1个号区 11_22_33
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;

            case 'JSHZ': //快三和值
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'JSSTTX': //快三   江苏三同号通选
                //parts = codes[0].split('_');  //111_222_333_444_555_666
                singleNum = 1;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'JSSLTX': //快三三连号通选
                singleNum = 1;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'JSEBT': //二不同号
                var codesLen = codes[0].length;
                singleNum = (codesLen - 1) * codesLen / 2;
                isDup = codesLen > 2 ? 1 : 0;
                break;
            case 'JSSTDX': //三同号单选
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = parts.length > 1 ? 1 : 0;
                break;
            case 'JSSBT': //三不同号
                var codesLen = codes[0].length;
                singleNum = (codesLen - 1) * (codesLen - 2) * codesLen / 6;
                isDup = codesLen > 3 ? 1 : 0;
                break;

            //快乐扑克
            case 'PKSZ': //顺子
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'PKBZ': //豹子
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'PKDZ': //对子
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'PKTH': //同花
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'PKTHS': //同花顺
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'PKBX': //包选
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'PKRX1': //任选1
                parts = codes[0].split('_');
                singleNum = parts.length;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'PKRX2': //任选2
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) / 2;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'PKRX3': //任选3
                parts = codes[0].split('_');
                singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / 6;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'PKRX4': //任选4
                parts = codes[0].split('_');
                singleNum = parts.length;
                var codeNum = parts.length;
                singleNum = codeNum * (codeNum - 1) * (codeNum - 2) * (codeNum - 3) / 24;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'PKRX5': //任选5
                parts = codes[0].split('_');
                var codeNum = parts.length;
                singleNum = codeNum * (codeNum - 1) * (codeNum - 2) * (codeNum - 3) * (codeNum - 4) / 120;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            case 'PKRX6': //任选6
                parts = codes[0].split('_');
                var codeNum = parts.length;
                singleNum = codeNum * (codeNum - 1) * (codeNum - 2) * (codeNum - 3) * (codeNum - 4) * (codeNum - 5) / 720;
                isDup = singleNum > 1 ? 1 : 0;
                break;
            default:
                throw "unknown method2 " + ps.curMethod.name;
                break;
        }

        return {
            singleNum: singleNum,
            isDup: isDup
        };
    };
}
export default GameLhc
//数组去重
function array_unique(inputArr) {
    

    var __array_search = function(needle, haystack) {
        var fkey = '';
        for (fkey in haystack) {
            if (haystack.hasOwnProperty(fkey)) {
                if ((haystack[fkey] + '') === (needle + '')) {
                    return fkey;
                }
            }
        }
        return false;
    };

    for (key in inputArr) {
        if (inputArr.hasOwnProperty(key)) {
            val = inputArr[key];
            if (false === __array_search(val, tmp_arr2)) {
                tmp_arr2[key] = val;
                tmp_arr3.push(val);
            }
        }
    }
    //return tmp_arr2;  //返回对象
    return tmp_arr3;  //返回数组
}