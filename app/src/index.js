import Web3 from "web3";
import StudentSocietyDAOArtifact from "../../build/contracts/StudentSocietyDAO.json";
import myERC20 from "../../build/contracts/myERC20";
const App = {
  web3: null,
  account: null,
  student: null,
   q:0, 
   start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = StudentSocietyDAOArtifact.networks[networkId];
      this.student= new web3.eth.Contract(
        StudentSocietyDAOArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      //this.refreshBalance();
      this.ready();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  ready: async function()
  {
  const {getaddress}=this.student.methods;
  const {getBankBalance}=this.student.methods;
  const {blanceready}=this.student.methods;
  const {initvote}=this.student.methods;
  await blanceready().send({from: this.account, gas:2000000000});
  const address=await getaddress().call();
  const theadress=document.getElementById("address");
  theadress.innerHTML=address.toString();
  const balance=await getBankBalance().call();
  const thbalance=document.getElementById("balance");
  thbalance.innerHTML=balance;
  this.proposallist();
  },

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

 disagreeproposal:async function(index)
 {
  const {disagree}=this.student.methods;
  await disagree(index).send({from: this.account, gas:200000});
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
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
