

const helper = {
            TMHZ: {
                0: 1,
                1: 3,
                2: 6,
                3: 10,
                4: 15,
                5: 21,
                6: 28,
                7: 36,
                8: 45,
                9: 55,
                10: 63,
                11: 69,
                12: 73,
                13: 75,
                14: 75,
                15: 73,
                16: 69,
                17: 63,
                18: 55,
                19: 45,
                20: 36,
                21: 28,
                22: 21,
                23: 15,
                24: 10,
                25: 6,
                26: 3,
                27: 1
            }
          }

class Game_xy28{

  constructor(props) {
      this.state = props;
  }


  factorial(n) {
      if (n <= 1) {
            return 1
        } else {
        return n * helper.factorial(n - 1)
          }
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




  isLegalCode(codes, mdCode){
                //这一段加上否则直选和值类玩法不选号也能添加
                if (this.allHasValue(codes)['charsNum'] == 0) {
                    return {
                        singleNum: 0,
                        isDup: 0
                    };
                }

                var singleNum = 0, isDup = 0, parts;
                switch (mdCode) {
                    case 'TMHZ':
                        parts = codes[0].split('_');
                        parts.map((v,k)=>{
                            singleNum += helper.TMHZ[v];
                        })
                        //
                        // $.each(parts, function(k, v) {
                        //
                        // });
                        isDup = parts.length > 1 ? 1 : 0;
                        break;
                    case 'XYDXDS':
                    case 'JDX':
                    case 'XYSB':
                    case 'TMBZ':
                        parts = codes[0].split('_');
                        singleNum = parts.length;
                        isDup = singleNum > 1 ? 1 : 0;
                        break;
                    case 'TMBS':
                        parts = codes[0].split('_');
                        if(parts.length >= 3){
                            singleNum = parts.length * (parts.length - 1) * (parts.length - 2) / 6;
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

  }


}

export default Game_xy28
