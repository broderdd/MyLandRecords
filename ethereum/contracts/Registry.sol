pragma solidity ^0.4.17;

/******************************************************************/
/******************************************************************/
/******************************************************************/
/*******************  FIRST CONTRACT ******************************/
/******************************************************************/
/******************************************************************/
/******************************************************************/

contract Registry {
    /********  DATA STRUCTURES ***********/
    struct User{
        bool isExist;  //whether user has been registered
        uint titleCount; //number of titles registered user has
        address[] myTitles; //Array of title addresses
        mapping(address => uint) activeTitles;  //based on index of myTitles array
        uint requestCount;
        address[] requestedTitles; 
        mapping(address => uint) activeRequests;  
        uint listedCount;
        address[] listedTitles;
        mapping(address => uint) activeLists;  
    }

    mapping(address => User)public userProfile;
    address[] public deployedTitles;
    address public admin = 0x156BD3d6579AD4D31849169794dA51DdF0eB58E0;
    string public registrationCost;

    /********  CONSTRUCTOR  ***********/
    function Registry() public{
        admin = msg.sender;
        registrationCost = '0.01';
    }
    
    /********  GETTER AND SETTERS ***********/

    modifier adminOnly(){
        require(msg.sender == admin);
        _;
    }

    function getAdmin() public view returns (string){
        return (
            toString(admin)
            );
    }

    function getDeployedTitles() public view returns (address[]) {
        return deployedTitles;
    }

    function getUser(address user) public view returns(
      bool, uint, address[], uint, address[], uint, address[]
      ){
        return (
            userProfile[user].isExist,
            userProfile[user].titleCount,
            userProfile[user].myTitles,
            userProfile[user].requestCount,
            userProfile[user].requestedTitles,
            userProfile[user].listedCount,
            userProfile[user].listedTitles
        );
    }

    function setRegistrationCost(string newCost) public {
        registrationCost = newCost;
    }
    function getRegistrationCost() public view returns(string){
        return registrationCost;
    }
    
    /******** HELPER FUNCTIONS ***********/

    // Helper function borrowed from https://ethereum.stackexchange.com/questions/8346/convert-address-to-string

    function toString(address x) public pure returns (string) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            byte b = byte(uint8(uint(x) / (2**(8*(19 - i)))));
            byte hi = byte(uint8(b) / 16);
            byte lo = byte(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }

    function char(byte b) public pure returns (byte c) {
        if (uint8(b) < 10) return byte(uint8(b) + 0x30);
        else return byte(uint8(b) + 0x57);
    }

    /******** MAIN FUNCTIONS ***********/
  
    function createTitle(address owner, uint value, uint size,  string id, string description) public adminOnly {
        address newTitle = new Title(address(this), msg.sender, owner, value,size, id, description);
        deployedTitles.push(newTitle);

        if (userProfile[owner].isExist){
            userProfile[owner].titleCount++;
            userProfile[owner].myTitles.push(newTitle);
            userProfile[owner].activeTitles[newTitle] = userProfile[owner].myTitles.length;
        }else{
            User memory newUser = User({
                isExist: true,
                titleCount:1,
                requestCount:0,
                listedCount:0,
                myTitles: new address[](0),
                requestedTitles: new address[](0),
                listedTitles: new address[](0)
            });
            userProfile[owner] = newUser;
            userProfile[owner].activeTitles[newTitle] =0;
            userProfile[owner].myTitles.push(newTitle);
        }
    }

    function addListedTitle(address owner, address title) public{
        userProfile[owner].listedCount++;
        userProfile[owner].listedTitles.push(title);
        userProfile[owner].activeLists[title] = userProfile[owner].listedCount-1;
    }

    function addRequestedTitle(address requester, address owner, address title) public{
        userProfile[requester].requestCount++;
        userProfile[owner].requestCount++;
        userProfile[requester].requestedTitles.push(title);
        userProfile[owner].requestedTitles.push(title);
        userProfile[requester].activeRequests[title] = userProfile[requester].requestCount-1;
        userProfile[owner].activeRequests[title] = userProfile[owner].requestCount-1;

        userProfile[owner].listedTitles[userProfile[owner].activeLists[title]] = userProfile[owner].listedTitles[userProfile[owner].listedCount -1];
        userProfile[owner].activeLists[userProfile[owner].myTitles[userProfile[owner].activeLists[title]]] = userProfile[owner].activeLists[title];
        delete userProfile[owner].listedTitles[userProfile[owner].listedCount -1];
        userProfile[owner].listedCount--;

    }
    function addNewTitle(address oldOwner, address newOwner, address title) public{
        userProfile[newOwner].titleCount++;
        userProfile[newOwner].myTitles.push(title);
        userProfile[newOwner].activeTitles[title] = userProfile[newOwner].titleCount-1;

        //remove title from "myTitles" repository of previous owner
        userProfile[oldOwner].myTitles[userProfile[oldOwner].activeLists[title]] = userProfile[oldOwner].myTitles[userProfile[oldOwner].titleCount -1];
        userProfile[oldOwner].activeTitles[userProfile[oldOwner].myTitles[userProfile[oldOwner].activeTitles[title]]] = userProfile[oldOwner].activeTitles[title];
        delete userProfile[oldOwner].myTitles[userProfile[oldOwner].titleCount -1];
        userProfile[oldOwner].titleCount--;

        //remove from requested pending lists of both previous owner and new owner
        userProfile[oldOwner].requestedTitles[userProfile[oldOwner].activeRequests[title]] = userProfile[oldOwner].requestedTitles[userProfile[oldOwner].requestCount -1];
        userProfile[oldOwner].activeRequests[userProfile[oldOwner].requestedTitles[userProfile[oldOwner].activeRequests[title]]] = userProfile[oldOwner].activeRequests[title];
        delete userProfile[oldOwner].requestedTitles[userProfile[oldOwner].requestCount -1];
        userProfile[oldOwner].requestCount--;

        userProfile[newOwner].requestedTitles[userProfile[newOwner].activeRequests[title]] = userProfile[newOwner].requestedTitles[userProfile[newOwner].requestCount -1];
        userProfile[newOwner].activeRequests[userProfile[newOwner].requestedTitles[userProfile[newOwner].activeRequests[title]]] = userProfile[newOwner].activeRequests[title];
        delete userProfile[newOwner].requestedTitles[userProfile[newOwner].requestCount -1];
        userProfile[newOwner].requestCount--;
    }   
}

/******************************************************************/
/******************************************************************/
/******************************************************************/
/*******************  SECOND CONTRACT *****************************/
/******************************************************************/
/******************************************************************/
/******************************************************************/

contract Title {

    /********  DATA STRUCTURES ***********/

    Registry public baseRegistry;
    address public admin;
    address public owner;
    address public potentialBuyer;
    address public newOwner;
    string public id;
    uint size;
    bool public available;
    bool public ownerApproved;
    uint public value;
    string public description;
    
    modifier ownerOnly(){
        require(msg.sender == owner);
        _;
    }
    
    modifier adminOnly(){
        require(msg.sender == admin);
        _;
    }

     /********  CONSTRUCTOR  ***********/
    
    function Title(address _registry, address _admin, address _owner, uint _value, uint _size, string _id, string memory _description) public{
        baseRegistry = Registry(_registry);
        admin = _admin;
        owner = _owner;
        value = _value;
        size = _size;
        id = _id;
        description = _description;
        ownerApproved = false;

        if (owner == address(0)){
            available = true;
        }
        else{
            available = false;
        }
    }

    /********  GETTER AND SETTERS ***********/

    function getDetails() public view returns
        (string, string,uint,uint,string,string,bool,address,bool){
            return(
                toString(admin),
                toString(owner),
                value,
                size,
                id,
                description,
                ownerApproved,
                potentialBuyer,
                available
            );
    }

    /******** HELPER FUNCTIONS ***********/
    // Helper function borrowed from https://ethereum.stackexchange.com/questions/8346/convert-address-to-string

    function toString(address x) public pure returns (string) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            byte b = byte(uint8(uint(x) / (2**(8*(19 - i)))));
            byte hi = byte(uint8(b) / 16);
            byte lo = byte(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }

    function char(byte b) public pure returns (byte c) {
        if (uint8(b) < 10) return byte(uint8(b) + 0x30);
        else return byte(uint8(b) + 0x57);
    }

    /******** MAIN FUNCTIONS ***********/

    function listTitle(uint newValue) public ownerOnly{
        value = newValue;
        available = true;
        baseRegistry.addListedTitle(msg.sender,address(this));
    }
    
    function transferRequest() public payable{
        require(available == true);
        //require(msg.value == baseRegistry.registrationCost());
        require(msg.sender != owner);
        require(potentialBuyer == address(0));
        
        available = false;
        potentialBuyer = msg.sender;

        baseRegistry.addRequestedTitle(potentialBuyer,owner,address(this));
    }
    
    function approveRequest() public ownerOnly{
        require(potentialBuyer != address(0));
    
        ownerApproved = true;
        newOwner = potentialBuyer;
        potentialBuyer = address(0);
    }
    function rejectRequest() public ownerOnly{
        require(potentialBuyer != address(0));
        
        available = true;
        potentialBuyer = address(0);
    }
    
    function finaliseRequest() public adminOnly{
        require(ownerApproved == true);
        baseRegistry.addNewTitle(owner, newOwner, address(this));

        owner = newOwner;
        ownerApproved = false;
        newOwner= address(0);
    }
}

