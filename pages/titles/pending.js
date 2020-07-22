import React, { Component } from 'react';
import {Card, Header} from 'semantic-ui-react';
import registry from '../../ethereum/registry';
import Title from '../../ethereum/title'; 
import Layout from '../../components/Layout';
import {Link} from '../../routes';

class PendingTitles extends Component{
    constructor(props){
        super(props);
        this.state={
            titleDetails: []
        };
    }

    async componentDidMount(){
        const titles =  await registry.methods.getDeployedTitles().call();
        titles.map(blockAddress=> {
            this.currentTitleState(blockAddress);    
        });
    }

    async currentTitleState(blockAddress){
        const title = Title(blockAddress);
        const details = await title.methods.getDetails().call();
        const ownerApproved = details[6];
        const potentialBuyer = details[7];
        const available = details[8];
        let pending = '';
        if(available){
            pending = 'available'
        }else if (ownerApproved && potentialBuyer){
            pending = 'notary'
        }else if (potentialBuyer > 0){
            pending = 'owner'
        }
        const result = {
            title: blockAddress,
            pending: pending
        }
        this.setState({
            titleDetails: [...this.state.titleDetails,result]
        });
    }
    renderAvailableTitles(){
        const items = this.state.titleDetails.map(blockAddress=> {
            let item = [];
            if(blockAddress.pending == 'available'){
                item = this.renderDetails(blockAddress.title);
            }    
            return item;
        });
        return <Card.Group items={items}/>;      
    }
    renderOwnerTitles(){
        const items = this.state.titleDetails.map(blockAddress=> {
            let item = [];
            if(blockAddress.pending == 'owner'){
                item = this.renderDetails(blockAddress.title);
            }    
            return item;
        });
        return <Card.Group items={items}/>;      
    }
    renderNotaryTitles(){
        const items = this.state.titleDetails.map(blockAddress=> {
            let item = [];
            if(blockAddress.pending == 'notary'){
                item = this.renderDetails(blockAddress.title);
            }   
            return item; 
        });
        return <Card.Group items={items}/>;      
    }

    renderDetails(blockAddress){
        return{
            header:blockAddress,
            description: 
                <Link route={`/titles/${blockAddress}`}>
                    <a>View Title</a>
                </Link>,
            fluid: true
        }
    }

    render(){
        return (
            <Layout>
                <div>      
                    <Header style={{marginTop: '25px'}} as='h1' textAlign='left'>
                        Titles needing approval by Land Office
                     </Header>
                     {this.renderNotaryTitles()}

                     <Header style={{marginTop: '25px'}} as='h1' textAlign='left'>
                        Titles needing approval by Owner
                     </Header>
                     {this.renderOwnerTitles()}

                     <Header style={{marginTop: '25px'}} as='h1' textAlign='left'>
                        Titles available for transfer
                     </Header>             
                    {this.renderAvailableTitles()}

             </div>
            </Layout>
        )
    }
}

export default PendingTitles;