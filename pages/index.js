import React, { Component } from 'react';
import {Card, Header} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import registry from '../ethereum/registry';
import Layout from '../components/Layout';
import {Link} from '../routes';

class myTitles extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: '',
            isExist : false,
            titleCount : 0,
            myTitles : [],
            requestCount : 0,
            requestedTitles : [],
            listedCount : 0,
            listedTitles : []
        }
    }

    async componentDidMount(){
        const user =  await registry.methods.getUser(window.web3.currentProvider.selectedAddress).call();
        this.setState({
            user: window.web3.currentProvider.selectedAddress,
            isExist: user[0],
            titleCount: parseInt(user[1]),
            myTitles: user[2],
            requestCount: parseInt(user[3]),
            requestedTitles: user[4],
            listedCount: parseInt(user[5]),
            listedTitles: user[6]
        })
    }
    renderUserDashboard(){
        return(
            <Card.Group style={{marginTop: '15px'}} itemsPerRow={2}>
                <Card>
                    <Card.Content>
                        <Card.Header as='h1' textAlign='center'>
                            Title Count
                        </Card.Header>
                        <Card.Header textAlign='center'>
                            {this.state.titleCount}
                        </Card.Header>
                    </Card.Content>
                    <Card.Content extra textAlign='center'>
                        Number of titles owned 
                    </Card.Content>
                 </Card>
                 <Card>
                    <Card.Content>
                        <Card.Header as='h1' textAlign='center'>
                            Pending Titles Count
                        </Card.Header>
                        <Card.Header textAlign='center'>
                            {this.state.requestCount + this.state.listedCount}
                        </Card.Header>
                    </Card.Content>
                    <Card.Content extra textAlign='center'>
                        Titles that you listed up or requested for ownership transfer. 
                    </Card.Content>
                </Card>
                 
                 
            </Card.Group>
        )
    }

    renderUserTitles(){
        //MyTitles Cards
        if(this.state.titleCount){
            const items = this.state.myTitles.map(blockAddress=> {
                return{
                    header:blockAddress,
                    description: 
                        <Link route={`/titles/${blockAddress}`}>
                            <a>View Title</a>
                        </Link>,
                    fluid: true
                }
            });
            return <Card.Group items={items}/>;
        }else{
            return(
                <div>
                    No Titles owned by user.
                </div>
            )
        }
    }

    renderRequestedTitles(){
        if(this.state.requestCount || this.state.listedCount){
            const requests = this.state.requestedTitles.map(blockAddress=> {
                return{
                    header:blockAddress,
                    description: 
                        <Link route={`/titles/${blockAddress}`}>
                            <a>View Title</a>
                        </Link>,
                    fluid: true
                }
            });
            const lists = this.state.listedTitles.map(blockAddress=> {
                return{
                    header:blockAddress,
                    description: 
                        <Link route={`/titles/${blockAddress}`}>
                            <a>View Title</a>
                        </Link>,
                    fluid: true
                }
            });
            const items = [...requests,...lists];
            return <Card.Group items={items}/>;
        }else{
            return(
                <div>
                    No ownership transfer requests or titles listed up for transfer.  
                </div>
            )
        }
    }

    render(){
        return (
            <Layout>
                <div>    
                    User: {this.state.user}
                    <Header style={{marginTop: '25px'}} as='h1' textAlign='center'>
                        MY DASHBOARD
                    </Header>
                    {this.renderUserDashboard()}
                    <Header style={{marginTop: '55px'}} as='h2' textAlign='left'>
                        MY TITLES
                    </Header>
                    {this.renderUserTitles()}
                    <Header style={{marginTop: '25px'}} as='h2' textAlign='left'>
                        PENDING TITLES
                    </Header>
                    {this.renderRequestedTitles()}

                    {/*<Button floated="right" content="Create Title" icon="add" primary={true}/>*/}

                </div>
            </Layout>
        )
    }
}

export default myTitles;