# blockchain-course-2022

### 1. 功能和实现分析

##### 1.显示账户余额和地址

该功能较为简单，均由相应的函数，而且前端页面也做好展示基本的显示即可

```c
function getBankBalance() external view returns (uint256) {
        return studentERC20.balanceOf(address(this));
    }
```

```c
 function getaddress() external view returns (address) {
        return address(this);
    }
```

```js
const {getaddress}=this.student.methods;
  const address=await getaddress().call();
  const theadress=document.getElementById("address");
  theadress.innerHTML=address.toString();
  const {getBankBalance}=this.student.methods;
  const balance=await getBankBalance().call();
  const thbalance=document.getElementById("balance");
  thbalance.innerHTML=balance;
```

##### 2.增加提案功能

该功能设置了一个相应的结构体和一个从index对应到结构体的map，再具体实现的过程中只需要将每个信息依次填入，再将合约的条数增加，同时扣除相应的金额。

在前端方面，需要获取到需要输入的信息，将该信息传入函数，在调用展示列表和余额显示的功能即可。

```c
struct Proposal {
        uint32 index; // index of this proposal
        address proposer; // who make this proposal
        uint256 startTime; // proposal start time
        uint256 duration; // proposal duration
        string name; // proposal name
        string content;
        uint256 agree;
        uint256 disagree;
        bool state;
    }



  mapping(uint32 => Proposal) proposals;
```

```c
 function addproposal(
        uint256 _duration,
        string memory _name,
        string memory _content
    ) public {
        studentERC20.transfer(msg.sender, 100);
        studentERC20.allow(msg.sender, 100);
        proposals[proposalIndex] = Proposal(
            proposalIndex,
            msg.sender,
            block.timestamp,
            _duration,
            _name,
            _content,
            0,
            0,
            false
        );
        voter[proposalIndex].ifvote = false;
        proposalIndex += 1;
    }
```

```js
theaddproposal : async function()
  {
    const { addproposal}=this.student.methods
      const p_name=document.getElementById("name").value;
      const P_content=document.getElementById("content").value;
      const P_duration=document.getElementById("duration").value;
      await addproposal(P_duration,p_name,P_content).send({from: this.account, gas: 2000000000});
      const {getproposalIndex}=this.student.methods;
      const proposalindex=await getproposalIndex().call();
      for(var i=0;i<proposalindex-1;i++)
    {
      table.deleteRow(table.rows.length-1);
    }
      this.proposallist();
      const {getBankBalance}=this.student.methods;
  const balance=await getBankBalance().call();
  const thbalance=document.getElementById("balance");
  thbalance.innerHTML=balance;
  },
```



##### 3. 展示提案功能

在合约编写上非常简单，只用对应index的结构即可。

在前端编写上首先需要编写出可更改的表格，之后在获得现在提案的数量，调用for循环获得。

同时由于设计上将操作按钮也放入了表格，因此需要在这个函数中向同意和反对的函数传入index值。

```c
function getproposal(uint32 index) public view returns (Proposal memory) {
        return proposals[index];
    }
```



```js
proposallist : async function()
   {
    const {getproposalIndex}=this.student.methods;
    const {getproposal}=this.student.methods;
    
   
    const proposalindex=await getproposalIndex().call();
    var tbody=document.querySelector("tbody");
    var datas=[
    ];
  var q=[];
    for(var i=0;i<proposalindex;i++)
    {
      q[i]=await getproposal(i).call();
    }
    for(var i=0;i<proposalindex;i++)
    {
      datas[i]=[];
      datas[i][0]=q[i][0];
      datas[i][1]=q[i][4];
      datas[i][2]=q[i][5];
      datas[i][3]=q[i][6];
      datas[i][4]=q[i][7];
      if(q[i][8]==true)
      {
        datas[i][5]="结束"
      }
      else if(q[i][8]==false)
      {
        datas[i][5]="未结束"
      }
    }
  
  
  for(var i=0;i<datas.length;i++) 
  {
      var tr=document.createElement("tr");
      tbody.appendChild(tr);
      for(var k in datas[i])   
      {
          var td=document.createElement("td");  
          tr.appendChild(td);
          td.innerHTML=datas[i][k]; 
      }
      var td=document.createElement("td");
      tr.appendChild(td);
      td.innerHTML="<b href='javascript:;'>同意</b>";
      var td=document.createElement("td");
      tr.appendChild(td);
      td.innerHTML="<c href='javascript:;'>反对</c>";
  }

  var as=document.querySelectorAll("b");
  for(var i=0;i<as.length;i++)
  {
      as[i].onclick= async function () {  
          var a=this.parentNode.parentNode.innerHTML[4];
          if(this.parentNode.parentNode.innerHTML[5]!="<")
          a=a+this.parentNode.parentNode.innerHTML[5];
            App.agreeproposal(a);
            console.log(q[a][2],q[a][3]);
      }
  }
  var bs=document.querySelectorAll("c");
  for(var i=0;i<bs.length;i++)
  {
      bs[i].onclick=function () {  
        console.log(this.parentNode.parentNode.innerHTML[4]);
        var b=this.parentNode.parentNode.innerHTML[4];
        if(this.parentNode.parentNode.innerHTML[5]!="<")
        b=b+this.parentNode.parentNode.innerHTML[5];
        App.disagreeproposal(b);
      }
  }
  },
```



##### 4. 同意和反对功能

同意和反对按钮在合约编写上只需要将提案对应的变量++即可，难点主要在处理“时间超过无法操作”和“一人只能操作一次”的判断条件上，操作成功后扣除相应的金额。

前端较为简单，按钮点击后调用相应的函数，在最后调用列表显示和余额显示。

```c
 function agreeproposal(uint32 index) public {
        if (
            (block.timestamp > proposals[index].startTime &&
                block.timestamp <
                (proposals[index].startTime + proposals[index].duration)) &&
            (voter[index].ifvote == false)
        ) {
            studentERC20.transfer(msg.sender, 50);
            studentERC20.allow(msg.sender, 50);
            proposals[index].agree++;
            voter[index].ifvote = true;
        }
    }
```

```js
agreeproposal:async function(index)
 {
  const {agreeproposal}=this.student.methods;
  await agreeproposal(index).send({from: this.account, gas: 200000});
  const {getproposalIndex}=this.student.methods;
  const proposalindex=await getproposalIndex().call();
  for(var i=0;i<proposalindex;i++)
{
  table.deleteRow(table.rows.length-1);
}
  this.proposallist();
  const {getBankBalance}=this.student.methods;
  const balance=await getBankBalance().call();
  const thbalance=document.getElementById("balance");
  thbalance.innerHTML=balance;
 },
```



##### 6. 奖励功能

在合约编写上只要满足相应的条件，将提案的状态更改，接着向提案发起者转入相应的金额

前端页面的编写上主要是需要先判断合约的状态，只有是"未结束"的才调用相应的函数，在最后调用列表显示和余额显示。

```c
 function rewards(uint32 index) public {
        if (
            block.timestamp >
            (proposals[index].startTime + proposals[index].duration)
        ) {
            proposals[index].state = true;
            if (proposals[index].agree > proposals[index].disagree) {
                studentERC20.airdrop(300);
            }
        }
    }
```

```js
reward: async function()
  {
    const {rewards}=this.student.methods;
    const {getproposalIndex}=this.student.methods;
    const {getstate}=this.student.methods;
      const proposalindex=await getproposalIndex().call();
      for(var i=0;i<proposalindex;i++)
      {
        const state=await getstate(i).call();
        if(state==false)
        await rewards(i).send({from: this.account, gas: 2000000000});
      }
      for(var i=0;i<proposalindex;i++)
    {
      table.deleteRow(table.rows.length-1);
    }
      this.proposallist();
      const {getBankBalance}=this.student.methods;
  const balance=await getBankBalance().call();
  const thbalance=document.getElementById("balance");
  thbalance.innerHTML=balance;
  }
```



### 2. 运行程序

本程序使用truffle框架

##### 1.下载truffle

```
npm install -g truffle
```

环境要求

- NodeJS 5.0+
- Windows，Linux，或Mac OS X

##### 2. 更改配置文件

在truffle-config.js中，将port更改为自己区块链的端口。

![image-20221106152314870](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106152314870.png)

在index.js的217行HttpProvider中同样更改为自己的区块链

![image-20221106152436838](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106152436838.png)

##### 3.更改metamask

打开metamask，选择导入账户。

![image-20221106152550453](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106152550453.png)

打开ganache，查看任意区块链的私钥，将区块链地址的私钥导入

![image-20221106152627961](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106152627961.png)

##### 4. 运行

在主文件夹的目录下执行

```
truffle migrate
```

再在app的目录下运行

```
npm run dev
```





### 3. 关键界面及流程截图

##### 1.部署代码

![image-20221106153037663](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106153037663.png)

##### 2. 打开前端页面

![image-20221106153142049](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106153142049.png)

##### 3. 发起交易

![image-20221106153220828](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106153220828.png)

##### 4. 确认交易，界面显示成功

![image-20221106153311083](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106153311083.png)

##### 5.发起提案

![image-20221106153356270](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106153356270.png)

![image-20221106153420226](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106153420226.png)





##### 6.同意或反对

![image-20221106153509518](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106153509518.png)

![image-20221106153539509](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106153539509.png)



##### 7.刷新页面，获得奖励

![image-20221106153621331](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106153621331.png)

![image-20221106153642191](C:\Users\tp\AppData\Roaming\Typora\typora-user-images\image-20221106153642191.png)