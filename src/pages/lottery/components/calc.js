//公共计算集合，后面可把投注公共方法都写进来

const Calc ={
    //获取模式
    getCurentMode:function(num) {
        let mode = 1;
        switch (num) {
            case "2元":
                mode = 1.0;
                break;
            case "1元":
                mode = 0.5;
                break;
            case "2角":
                mode = 0.1;
                break;
            case "1角":
                mode = 0.05;
                break;
            case "2分":
                mode = 0.01;
                break;
            case "1分":
                mode = 0.005;
                break;
            case "2厘":
                mode = 0.001;
                break;
            default:
                mode=1.0
        }

        return mode;
    },
    //获取模式名
    getCurentModeName:function(num) {
        let mode = 1;
        num=parseFloat(num);
        switch (num) {
            case 1:
                mode = "2元";
                break;
            case 0.5:
                mode = "1元";
                break;
            case 0.1:
                mode = "2角";
                break;
            case 0.05:
                mode = "1角";
                break;
            case 0.01:
                mode = "2分";
                break;
            case 0.001:
                mode = "2厘";
                break;
            default:
                mode=1.0
        }

        return mode;
    }
};


export default Calc