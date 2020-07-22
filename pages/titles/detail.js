import React, {Component} from 'react';
import {Button, Card, Form, Message} from 'semantic-ui-react';
import Parser from 'html-react-parser';
import Layout from '../../components/Layout';
import Title from '../../ethereum/title'; 
import registry from '../../ethereum/registry'
import web3 from '../../ethereum/web3';


//need to call method from above to get local copy of a specific title contract
//Pass in "props.query.blockAddress" from routes.js as seen in line 11


class TitleDetails extends Component{
    //props paraemter is a separate prop's object than the one that ends up inside of our actual component instance
    //this prop's object has a property called query and one property on this query thing right here is that token out of the URL.   
    static async getInitialProps(props){
        const title = Title(props.query.blockAddress);
        const details = await title.methods.getDetails().call();
        const cost = await registry.methods.getRegistrationCost().call();
        //pass in specific properties from details object (from Title instance contract)
        return{
            adminAddress: '0x' + details[0],
            ownerAddress: '0x' + details[1],
            titleAddress: props.query.blockAddress, //get address of actual title instance
            value: details[2],
            size: details[3],
            id: details[4],
            description: details[5],
            ownerApproved: details[6],
            potentialBuyer: details[7],
            available: details[8],
            registrationCost: cost,
            date: '',
        };
    }
    
    constructor(props){
        super(props);
        this.state={
            currentAddress: '',
            spinner: false,
            error: '',
            success_state:'',
            success_link:'',
            function_name:''
        }
    }

    componentDidMount(){
        this.setState({
            currentAddress: window.web3.currentProvider.selectedAddress
        })
    }

    handleOwnerListing = async (event) => {
        event.preventDefault(); //prevent from auto submitting to a "server"
        const title = Title(this.props.titleAddress)
        this.setState({spinner:true,error:'',success_state:'', success_link: ''});
        try{
            //Attempt to create title creation transaction
            this.setState({success_state:'Please wait, title is being listed...'})
            //const accounts = await web3.eth.getAccounts();
            await title.methods.listTitle(1000000).send({
                    from:window.web3.currentProvider.selectedAddress                    //Assuming the user has at least one account that we can use
                });
            
            //Update user message on screen
            this.setState({success_state:"Success! Title has been listed up for transfer."});
            this.setState({success_link:'You can view the title on pending requests page'});
            //Router.pushRoute('/');    //Redirect to index page 
        }catch (err){
            this.setState({error:err.message})
            this.setState({success_state:''})
        }
        this.setState({spinner:false});
    };

    handleRequest = async (event) => {
        event.preventDefault(); //prevent from auto submitting to a "server"
        const title = Title(this.props.titleAddress)
        this.setState({spinner:true,error:'',success_state:'', success_link: ''});
        try{
            //Attempt to create title creation transaction
            this.setState({success_state:'Please wait, request is being created...'})
            const accounts = await web3.eth.getAccounts();
            await title.methods.transferRequest().send({
                    from:window.web3.currentProvider.selectedAddress,
                    value: web3.utils.toWei(this.props.registrationCost, 'ether')
            });
            //Update user message on screen
            this.setState({success_state:"Success! Request has been sent"});
            this.setState({success_link:'You can view the title on pending requests page'});
            //Router.pushRoute('/');    //Redirect to index page 
        }catch (err){
            this.setState({error:err.message})
            this.setState({success_state:''})
        }
        this.setState({spinner:false});
    };

    handleOwnerApproval = async (event) => {
        event.preventDefault(); //prevent from auto submitting to a "server"
        const title = Title(this.props.titleAddress)
        this.setState({spinner:true,error:'',success_state:'', success_link: ''});
        try{
            //Attempt to create title creation transaction
            this.setState({success_state:'Please wait, approval is in process...'})
            const accounts = await web3.eth.getAccounts();
            await title.methods.approveRequest().send({
                    from:window.web3.currentProvider.selectedAddress                    //Assuming the user has at least one account that we can use
                });
            //Update user message on screen
            this.setState({success_state:"Success! You have approved the Transfer Request"});
            this.setState({success_link:'Please now wait for approval from Land Office.'});
            //Router.pushRoute('/');    //Redirect to index page 
        }catch (err){
            this.setState({error:err.message})
            this.setState({success_state:''})
        }
        this.setState({spinner:false});
    };
    
    handleAdminApproval = async (event) => {
        event.preventDefault(); //prevent from auto submitting to a "server"
        const title = Title(this.props.titleAddress)
        this.setState({spinner:true,error:'',success_state:'', success_link: ''});
        try{
            //Attempt to create title creation transaction
            this.setState({success_state:'Please wait, finalisation is in process...'})
            const accounts = await web3.eth.getAccounts();
            await title.methods.finaliseRequest().send({
                    from:window.web3.currentProvider.selectedAddress                    //Assuming the user has at least one account that we can use
                });
            
            //Update user message on screen
            this.setState({success_state:"Success! Title has been updated"});
            this.setState({success_link:'Ownership has been transferred. Please refresh the page for updated details.'});
            //Router.pushRoute('/');    //Redirect to index page 
        }catch (err){
            this.setState({error:err.message})
            this.setState({success_state:''})
        }
        this.setState({spinner:false});
    };
 
    titleStatus(){
        const {ownerApproved,potentialBuyer,available} = this.props;
        if(available){
            return 'Available for Ownership Transfer'
        }else if(ownerApproved && potentialBuyer){
            return 'Owner Approved an Ownership Transfer Request, Awaiting Approval from Land Office'
        }
        else if(potentialBuyer>0){
            return 'An Ownership Transfer Request has been sent. Awaiting response from Owner'
        }else{
            return 'Approved by Land Office, Ownership details below'
        }
    }
    renderDetails(){
        const{
            id, 
            titleAddress,
            ownerAddress, 
            adminAddress, 
            date, 
            value, 
            size
        } = this.props;
        return(
            <Card  fluid>
                <Card.Content header={`Title ID: ${id}`} />
                <Card.Content description={`Title Blockcahin Address: ${titleAddress}`}/>
                <Card.Content description={`Owner Blockcahin Address: ${ownerAddress}`}/>
                <Card.Content description={`Admin Blockcahin Address: ${adminAddress}`}/>
                <Card.Content extra>
                    Date Of Issue: {date}
                </Card.Content>
                <Card.Content extra>
                    Value: {value}
                </Card.Content>
                <Card.Content extra>
                    Size: {size}
                </Card.Content>
            </Card>
        )
    }

    render(){

        return (
            <div>
                <Layout>
                    <h3> Title Details</h3>
                    <Message style={{marginTop: '25px'}} info>
                        <Message.Header>STATUS: {this.titleStatus()} </Message.Header>
                     </Message>
                    {this.renderDetails()}

                    {!(this.props.ownerAddress==this.state.currentAddress 
                        && !this.props.available && !this.props.ownerApproved 
                        && this.props.potentialBuyer==0) ? null : (
                            <Form onSubmit={this.handleOwnerListing} error={!!this.state.error} success={!!this.state.success_state} >
                                <Button loading={this.state.spinner} style={{marginBottom: '15px'}} 
                                 floated="left" content="List Title Up for Ownership Transfer" icon="add" primary={true}/>
                                 <Message error header="Whoops! An error has occured." content={this.state.error}/>
                                <Message success color='blue'>
                                    <Message.Header>{this.state.success_state}</Message.Header>
                                    <p>{Parser(this.state.success_link)}</p>
                                </Message>
                            </Form>
                     )}
                    {!(this.props.available 
                        && this.state.currentAddress!=this.props.adminAddress 
                        && this.state.currentAddress!= this.props.ownerAddress) 
                        ? null : (
                            <Form onSubmit={this.handleRequest} error={!!this.state.error} success={!!this.state.success_state} >
                                <Button loading={this.state.spinner}  style={{marginBottom: '15px'}} 
                                 floated="left" content="Request Transfer" icon="add" primary={true}/>
                                 <Message error header="Whoops! An error has occured." content={this.state.error}/>
                                <Message success color='blue'>
                                    <Message.Header>{this.state.success_state}</Message.Header>
                                    <p>{Parser(this.state.success_link)}</p>
                                </Message>
                            </Form>                    
                    )}
                    {!(this.props.ownerApproved 
                        &&  this.state.currentAddress==this.props.adminAddress) ? null : (
                            <Form onSubmit={this.handleAdminApproval} error={!!this.state.error} success={!!this.state.success_state} >
                                <Button loading={this.state.spinner} style={{marginBottom: '15px'}} 
                                 floated="left" content="Finalise Transfer Request" icon="add" primary={true}/>
                                 <Message error header="Whoops! An error has occured." content={this.state.error}/>
                                <Message success color='blue'>
                                    <Message.Header>{this.state.success_state}</Message.Header>
                                    <p>{Parser(this.state.success_link)}</p>
                                </Message>
                            </Form>                    
                    )}
                    {!(this.props.potentialBuyer>0 
                        && this.state.currentAddress==this.props.ownerAddress) ? null: (
                           <Form onSubmit={this.handleOwnerApproval} error={!!this.state.error} success={!!this.state.success_state} >
                                <Button loading={this.state.spinner} style={{marginBottom: '15px'}} 
                                 floated="left" content="Approve Transfer Request" icon="add" primary={true}/>
                                 <Message error header="Whoops! An error has occured." content={this.state.error}/>
                                <Message success color='blue'>
                                    <Message.Header>{this.state.success_state}</Message.Header>
                                    <p>{Parser(this.state.success_link)}</p>
                                </Message>
                            </Form>                  
                    )}   
                 </Layout>
            </div>          
        )
    }
}

export default TitleDetails;