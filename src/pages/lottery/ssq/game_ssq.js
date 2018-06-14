
class Game_ssq{


     constructor(props){

         this.state=props;
     }


    factorial(n) {
        if (n <= 1) {
            return 1
        } else {
            return n * helper.factorial(n - 1)
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
        var pos = issue.indexOf("-");
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


   isLegalCode(codes,mdCode) {
        //这一段加上否则直选和值类玩法不选号也能添加
        if (this.allHasValue(codes)['charsNum'] == 0) {
            return {
                singleNum: 0,
                isDup: 0
            };
        }

        var singleNum = 0, isDup = 0, parts;
        switch (mdCode) {

            case 'HLZX'://["01_03_04_05", "02_03"]
                if(Object.prototype.toString.call(codes)=='[object Array]'){//复试
                  let  part1 = codes[0].split('_');
                  let   part2 = codes[1].split('_');
                    if(part1.length >= 5 && codes[1] != '' && part2.length >= 1 ){
                        singleNum = (part1.length * (part1.length-1) * (part1.length-2) * (part1.length-3) * (part1.length-4) / 120) * part2.length;
                        isDup = singleNum > 1 ? 1 : 0;
                    }
                }else if(/^(([012]\d)|(3[0123]))(_(([012]\d)|(3[0123]))){4},((0[1-9])|(1[0-6]))$/.test(codes)){//单式
                    singleNum = 1;
                    isDup = singleNum > 1 ? 1 : 0;
                }
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

export  default Game_ssq