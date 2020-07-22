const Registry = artifacts.require('Registry');

module.exports = (deployer) => {
  deployer.deploy(Factory);
}