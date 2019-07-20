# Validate.js 验证模块

## 是什么
用于字符串验证的工具，支持逻辑符连接多个验证，以及异步验证

## 起步
通过 script 标签引入模块 
```
<script src='validate.js'></script>
```

## 创建实例
导入 js 文件后，会在全局创建 Validate 类，通过其静态方法 create 创建实例。
需要一个 option 参数，包含 use / custom 两个属性，前者声明所需要加载的默认验证方法，后者定义自己所创建的自定义验证方法。

```
var check = Validate.create({
	use:['noBlank','email']
	custom: {
		male: function (v) {
			return /(丈夫|前夫|公公|婆婆|夫兄|夫弟|夫姐|夫妹)/.test(v)
		},
		female: function (v) {
			return /(妻子|前妻|岳母|岳父|妻兄|妻弟|妻姐|妻妹)/.test(v)
		}
	}
})

```
## 对数据进行验证
### 调用
以柯里化的方式进行调用，首先传入所需校验的数据，之后在传入提示信息。
```
var result = check.noBlank(name)('姓名不能为空')
```
### 返回值
当验证通过时，会返回 fasle ；

当验证不通过的时候，如果第二次调用传入 msg ，则返回 msg ，否在返回 true

### Question：为什么返回 false 表示验证成功。
或许很多人觉得用 true 表示验证成功更能表达语义。但是考虑到调用的方便，这里仍选用 fasle 表示验证成功
```
var result = check.noBlank(name)('姓名不能为空！')
// 判断结果，如果不通过，显示提示信息并终止进一步操作
if(result) return alert(reslut)
```
并且以 fasle 表示返回结果可以很方便地用逻辑运算符进行多个数据地判断

```
var result = check.noBlank(name)('姓名不能为空！')
	||check.noBlank(email)('邮箱不能为空！')
	||check.email(email)('所填写地邮箱格式不正确！')
if(result) return alert(reslut)
```
## 自定义验证
### 定义验证方法
在创建实例地时候可以传入自己定义地验证方法
```
var check = Validate.create({
	custom: {
		male: function (v) {
			return /(丈夫|前夫|公公|婆婆|夫兄|夫弟|夫姐|夫妹)/.test(v)
		}
	}
})
````
所定义的验证方法的参数为第一次调用时所传入的需要进行验证的数据，返回值为 boolen 类型。
之后可在 check 对象上进行调用

```
var reslut = check.male(relationship)('男性用户不能有丈夫/前夫/公公等亲属信息')
```
### 在自定义验证方法中设置提示信息
自定义方法中除了可以返回 boolen ，还可以返回 string 作为验证失败的提示信息。当第二次调用的时候未传入参数，那么会将这些提示信息作为结果返回。

```
var check = Validate.create({
	custom: {
		male: function (v) {
		    if(/丈夫/.test(v)) return '男性用户不能有丈夫信息'
			if(/前夫/.test(v)) return '男性用户不能有前夫信息'
			if(/公公/.test(v)) return '男性用户不能有公公信息'
			if(/丈夫/.test(v)) return '男性用户不能有丈夫信息'
			if(/婆婆/.test(v)) return '男性用户不能有婆婆信息'
			if(/夫兄/.test(v)) return '男性用户不能有夫兄信息'
			if(/夫弟/.test(v)) return '男性用户不能有夫弟信息'
			if(/夫姐/.test(v)) return '男性用户不能有夫姐信息'
			if(/夫妹/.test(v)) return '男性用户不能有夫妹信息'
			return false
		}
	}
})

var reslut = check.male(relationship)()
```

## 逻辑运算
显然很多情况下需要多个验证方法的逻辑连接才能确定验证结果，比如说，当邮箱不为空的时候验证邮箱格式是否正确。于是第一次调用传入数据后的返回结果上有 not/and/all 三个运算符来进行逻辑连接。

### not 运算符
not 运算符是对运算结果的取反操作
```
var reslt = check.noBlank(name).not()('姓名应该为空值！')
```
### and 运算符
or 运算符所需要一个参数，其为另一个验证逻辑，然后根据两个验证逻辑的结果取交
```
var reslt = chek.notBlank(email)
	.and(check.email(email))
	('邮箱不应为空,且邮箱格式需要满足标准！')

```
### or 运算符
or 运算符所需要一个参数，其为另一个验证逻辑，然后根据两个验证逻辑的结果取并
```
var reslt = chek.blank(email)
	.or(check.email(email))
	('当邮箱不为空的时候,邮箱格式需要满足标准！')
```

## 异步验证
（待更新...）
