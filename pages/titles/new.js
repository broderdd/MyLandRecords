import React, {Component} from 'react';
import {Form,Button,Label, Input, Message} from 'semantic-ui-react'
import Parser from 'html-react-parser';
import Layout from '../../components/Layout';
import registry from '../../ethereum/registry';   //Using lowercase factory because this is an instance of a contract
import web3 from '../../ethereum/web3';

/** Import two separate helpers from route's file (link and router) 
Link object is a React component that allows to render anchor tags 
into our React components and navigate around the application.
The router object allows us to programme redicrection from one page
to another page inside of our app. (E.g after creation of a title)
**/
import {Router} from '../../routes';

/**
Remember that whenever we want to handle some user input inside of React component 
there's two things we have to do. We're going to set up a new piece of state to 
hold that value that the user is entering and then we're also going to add a change
handler (the event handler) on the actual input component itself. 
 */

class TitleNew extends Component{
    state={
        address:'',
        titleID:'',
        value:'',
        size:'',
        description:'',
        error: '',
        success_state:'',
        success_link:'',
        spinner: false
    };

    
    //remember whenever we call a function on a contract it's always going to be
    // asynchronous in nature.
    onSubmit = async (event) => {
        event.preventDefault(); //prevent from auto submitting to a "server"

        this.setState({spinner:true,error:'',success_state:'', success_link: ''});
        try{
            //Attempt to create title creation transaction
            this.setState({success_state:'Please wait, title is being created...'})
            const accounts = await web3.eth.getAccounts();
            await registry.methods
                .createTitle(
                    this.state.address,
                    this.state.titleID, 
                    this.state.value,
                    this.state.size,
                    this.state.description
                ).send({
                    from:window.web3.currentProvider.selectedAddress                    //Assuming the user has at least one account that we can use
                });
            
            //Update user message on screen
            this.setState({success_state:"Success! Title has been inserted into blockchain network."});
            this.setState({success_link:'You can view the title on <a>the home page </a>'});
            //Router.pushRoute('/');    //Redirect to index page 
        }catch (err){
            this.setState({error:err.message})
            this.setState({success_state:''})
        }
        this.setState({spinner:false});
        
    };

    render(){
        return (
            <Layout>
                <h3>Create a new Title</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.error} success={!!this.state.success_state}>
                    <Form.Field>
                        <Input 
                            type='text' 
                            placeholder='Owner Address'
                            value={this.state.address}
                            onChange={event=>this.setState({address:event.target.value})}
                        />
                        <Label pointing>Please enter a Blockchain address</Label>
                    </Form.Field>
                    <Form.Field>
                        <Input 
                            type='text' 
                            placeholder='Title ID'
                            value={this.state.titleID}
                            onChange={event=>this.setState({titleID:event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input 
                            placeholder = 'Value'
                            type="text"
                            label = "$"
                            labelPosition = "right"
                            value={this.state.value}
                            onChange={event=>this.setState({value:event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input 
                            placeholder = 'Size'
                            label = "m²"
                            labelPosition = "right"
                            value={this.state.size}
                            onChange={event=>this.setState({size:event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input 
                            type='text' 
                            placeholder='Description'
                            value={this.state.description}
                            onChange={event=>this.setState({description:event.target.value})}
                        />
                    </Form.Field>
                    <Message error header="Whoops! An error has occured." content={this.state.error}/>
                    <Button loading={this.state.spinner} primary> Create</Button>
                    <Message success color='blue'>
                        <Message.Header>{this.state.success_state}</Message.Header>
                        <p>{Parser(this.state.success_link)}</p>
                    </Message> 

                </Form>
                
            </Layout>
        )
    }
}

export default TitleNew;