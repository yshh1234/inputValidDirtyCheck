/**
 * Created by Administrator on 2016/11/15.
 */
/**
 *
 * @param option
 * type 触发条件
 * app 监控域
 * reg 自定义正则
 * errStyle 错误样式(针对input)
 * errMsg 自定义错误语句
 * timeOut true脏检查/false[default]非脏检查
 *
 * @param callback 初始化后执行
 * @param OnCallback input发生变化后执行
 * _this.xht为错误信息
 */
function inputValid(option,callback,OnCallback){
    var _this = this;
    this.init(option,OnCallback);
    callback.call(this);
}
inputValid.prototype = {
    states:{},
    type:'',
    field:'',
    _reg:{},
    _errStyle:{},
    _oriStyle:{},
    _errMsg:{},
    timeOut:false,
    xht:{},
    init:function (option,OnCallback) {
        var _this = this;
        _this.field = option.app||'body';
        _this.type = option.type||'input';
        _this._reg = option.reg||{};
        _this._errStyle = option.errStyle||{ 'border-color':'#f00'};
        _this._errMsg = option.errMsg||{};
        _this.timeOut = option.timeOut||false;
        var sLength =  $(_this.field).find('input').length;
        for (var i = 0 ; i<sLength;i++){
            _this.states[$(_this.field).find('input')[i].getAttribute('data-name')] = {
                    type:$(_this.field).find('input')[i].getAttribute('data-type'),
                    value:''
                };
        }
        $(_this.field).on(_this.type,'input',function () {
            _this.validData(this);
            _this.set(this);
            OnCallback.call(_this);
        });
        if(_this.timeOut){
            _this.interval();
        }
    },
    /**
     * @param $el
     */
    validData:function ($el) {
        var _this = this;
        var _$el = $($el);
        var type = _$el.attr('data-type');
        var reg ;
        var _reg = _this._reg;
        var errMsg = '';
        switch (type){
            case 'email':
                reg = _reg.email||/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
                errMsg = '邮箱格式错误';
                break;
            case 'tel':
                reg = _reg.tel || /^1[34578]\d{9}$/;
                errMsg = '手机号码格式错误';
                break;
            case 'amount':
                reg = _reg.amount || /^\d{0,7}(?:\.\d{0,2})?$/;
                errMsg = '金额格式错误';
                break;
            case 'userName':
                reg = _reg.userName || /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
                errMsg = '用户名格式错误';
                break;
            case 'qicq':
                reg = _reg.qicq || /[1-9][0-9]{4,}/;
                errMsg = 'QQ格式错误';
                break;
            case 'zipcode':
                reg = _reg.zipcode || /[1-9]\d{5}(?!\d)/;
                errMsg = '邮编格式错误';
                break;
            case 'ipaddress':
                reg = _reg.ipaddress || /\d+\.\d+\.\d+\.\d+/;
                errMsg = 'IP地址格式错误';
                break;
            default:
                reg = _reg[_$el.attr('data-type')];
                errMsg = _this._errMsg[_$el.attr('data-type')];
        }
        if(!reg.test(_$el.val())&&_$el.val()!==''){
            if(_this.states[_$el.attr('data-name')].value===''){
                for(key in _this._errStyle){
                    _this._oriStyle[key] = _$el.css(key);
                }
            }
            _this.xht[_$el.attr('data-name')] = errMsg;
            _$el.css(_this._errStyle);
        }else{
            delete _this.xht[_$el.attr('data-name')]
            _$el.css(_this._oriStyle);
        }
    },
    set:function ($el) {
        var _$el = $($el);
        this.states[_$el.attr('data-name')] = {
            type:_$el.attr('data-type'),
            value:_$el.val()
        };
    },
    get:function (name) {
        return this.states[name].value;
    },
    interval:function () {
        var _this = this;
        this.timeOut = setInterval(function () {
            for(key in _this.states){
                $(_this.field).find('[data-name='+key+']').val(_this.states[key].value);
                _this.validData($(_this.field).find('[data-name='+key+']')[0])
            }
        },300)
    }
};