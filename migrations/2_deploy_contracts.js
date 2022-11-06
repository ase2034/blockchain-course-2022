const MyERC20 = artifacts.require("MyERC20");
const StudentSocietyDAO = artifacts.require("StudentSocietyDAO");

module.exports = function(deployer) {
  deployer.deploy(MyERC20,"bccoin","bccoimSymbol");
  deployer.link(MyERC20, StudentSocietyDAO);
  deployer.deploy(StudentSocietyDAO);
};
