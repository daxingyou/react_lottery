

const helper = {
  SXBD: {
      0: 1,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 7,
      7: 8,
      8: 10,
      9: 12,
      10: 13,
      11: 14,
      12: 15,
      13: 15,
      14: 15,
      15: 15,
      16: 14,
      17: 13,
      18: 12,
      19: 10,
      20: 8,
      21: 7,
      22: 5,
      23: 4,
      24: 3,
      25: 2,
      26: 1,
      27: 1
  },
  EXBD: {
      0: 1,
      1: 1,
      2: 2,
      3: 2,
      4: 3,
      5: 3,
      6: 4,
      7: 4,
      8: 5,
      9: 5,
      10: 5,
      11: 4,
      12: 4,
      13: 3,
      14: 3,
      15: 2,
      16: 2,
      17: 1,
      18: 1
  },
  SXHZ: {
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
  },
  EXHZ: {
      0: 1,
      1: 2,
      2: 3,
      3: 4,
      4: 5,
      5: 6,
      6: 7,
      7: 8,
      8: 9,
      9: 10,
      10: 9,
      11: 8,
      12: 7,
      13: 6,
      14: 5,
      15: 4,
      16: 3,
      17: 2,
      18: 1
  },
  SXZXHZ: {
      1: 1,
      2: 2,
      3: 2,
      4: 4,
      5: 5,
      6: 6,
      7: 8,
      8: 10,
      9: 11,
      10: 13,
      11: 14,
      12: 14,
      13: 15,
      14: 15,
      15: 14,
      16: 14,
      17: 13,
      18: 11,
      19: 10,
      20: 8,
      21: 6,
      22: 5,
      23: 4,
      24: 2,
      25: 2,
      26: 1
  }
          }

class Game_pks{

  constructor(props) {
      this.state = props;
  }
  expandLotto(nums) {
      var result = [];
      var tempVars = [];
      var oneAreaIsEmpty = 0;
      // $.each(nums,
      //         function(k, v) {
      //             if ($.trim(v) == "") {
      //                 oneAreaIsEmpty = 1;
      //                 return
      //             }
      //             var tmp = v.split("_");
      //             tmp.sort();
      //             tempVars.push(tmp);
      //         });
      for(let i=0;i<nums.length;i++){
          if (nums[i].trim() == "") {
                          oneAreaIsEmpty = 1;
                          break;
                      }
                    var tmp = nums[i].split("_");
                    tmp.sort();
                    tempVars.push(tmp);
      }

      if (oneAreaIsEmpty) {
          return [];
      }

      var i, j, k, L, m;
      switch (nums.length) {

          case 2:
              for (i = 0; i < tempVars[0].length; i++) {
                  for (j = 0; j < tempVars[1].length; j++) {
                      result.push(tempVars[0][i] + " " + tempVars[1][j]);
                  }
              }

              break;
          case 3:
              for (i = 0; i < tempVars[0].length; i++) {
                  for (j = 0; j < tempVars[1].length; j++) {
                      for (k = 0; k < tempVars[2].length; k++) {
                          result.push(tempVars[0][i] + " " + tempVars[1][j] + " " + tempVars[2][k]);
                      }
                  }
              }
              break;
          case 5:
              for (i = 0; i < tempVars[0].length; i++) {
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
      var finalResult = [];
      // $.each(result,
      //         function(k, v) {
      //             var $parts = v.split(" ");
      //             var tmp = array_unique($parts);
      //             if (tmp.length == $parts.length) {
      //                 finalResult.push(v);
      //             }
      //         });

      for(var i=0;i<result.length;i++){

        var parts = result[i].split(" ");
                   var tmp = this.array_unique(parts);
                   if (tmp.length == parts.length) {

                       finalResult.push(result[i]);
      }
  }
    return finalResult;
}
array_unique(inputArr) {
   // http://kevin.vanzonneveld.net
   // +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
   // +      input by: duncan
   // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   // +   bugfixed by: Nate
   // +      input by: Brett Zamir (http://brett-zamir.me)
   // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   // +   improved by: Michael Grier
   // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
   // %          note 1: The second argument, sort_flags is not implemented;
   // %          note 1: also should be sorted (asort?) first according to docs
   // *     example 1: array_unique(['Kevin','Kevin','van','Zonneveld','Kevin']);
   // *     returns 1: {0: 'Kevin', 2: 'van', 3: 'Zonneveld'}
   // *     example 2: array_unique({'a': 'green', 0: 'red', 'b': 'green', 1: 'blue', 2: 'red'});
   // *     returns 2: {a: 'green', 0: 'red', 1: 'blue'}
   var key = '',
           tmp_arr2 = {}, val = '', tmp_arr3 = [];

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
                        case 'PKS-DXDS':
                            singleNum = codes[0].length;
                            isDup = 0;
                            break;
                        case 'PKS-GYHZ':  //冠亚和值
                        case 'PKS-CGJ':  //前1 01
                            if (codes.length !== 1) {
                                return {
                                    singleNum: 0,
                                    isDup: 0
                                };
                            }
                            var result = codes[0].split('_');
                            singleNum = result.length;
                            isDup = singleNum > 1 ? 1 :  0;
                            break;
                        case 'PKS-DWD':
                        case 'PKS-DWDH5':
                            // $.each(codes, function(k, v) { //前5定位胆 01_02_03,04_05,06_07为一单 也可以只买一位，如'01_02_03,,,,'表示只买第一名胆，没买的位留空
                            //     if (v != '') {
                            //         //号码不得重复
                            //         parts = v.split('_');
                            //         singleNum += parts.length;  //注意是数组长度，所以前面必须判断v != ''
                            //     }
                            // }
                            for(let i=0;i<codes.length;i++){
                              if (codes[i] != '') {
                                     //号码不得重复
                                     parts = codes[i].split('_');
                                     singleNum += parts.length;  //注意是数组长度，所以前面必须判断v != ''
                                 }
                            }
                            isDup = singleNum > 5 ? 1 : 0;
                            break;
                        case 'PKS-CQS'://前三直选 01_02_03_04,02_03,01_05
                            if (codes.length !== 3) {
                                return {
                                    singleNum: 0,
                                    isDup: 0
                                };
                            }
                            var result = this.expandLotto(codes);
                            singleNum = result.length;
                            isDup = singleNum > 1 ? 1 : 0;
                            break;
                        case 'PKS-CQE':    //pk拾前二直选01_02_03_04,02_03
                            if (codes.length !== 2) {
                                return {
                                    singleNum: 0,
                                    isDup: 0
                                };
                            }
                            var result = this.expandLotto(codes);
                            singleNum = result.length;
                            isDup = singleNum > 1 ? 1 : 0;
                            break;
                        case 'PKS-OT':
                        case 'PKS-TN':
                        case 'PKS-TE':
                        case 'PKS-FS':
                        case 'PKS-FSIX':
                            if(codes.length !== 1 || (codes[0] !== '龙' && codes[0] !== '虎')){
                                return {
                                    singleNum: 0,
                                    isDup: 0
                                };
                            }
                            isDup = singleNum = 1;
                            break;
                            case 'PKS-GYDXDS'://两面冠亚和值
                      
                                singleNum = codes[0].split("_").length;
                                isDup = 0;
                                break;
                        case 'PKS-Q5LM':
                        case 'PKS-H5LM':
                            var n = 4; //5!
                            for (var i = 0; i < 5; i++) {
                              var code = codes[i].split('_');
                                if (code != '') {

                                    singleNum += code.length;
                                }
                            }
                            isDup = singleNum > 1 ? 1 : 0;
                            break;
                        default:
                            throw "unknown method2 " ;
                            break;
                    }
                    return {
                        singleNum: singleNum,
                        isDup: isDup
                    };

  }


}

export default Game_pks
