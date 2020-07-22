import React, { Component } from 'react';
import {Card, Button} from 'semantic-ui-react';
import registry from '../../ethereum/registry';
import Layout from '../../components/Layout';
import {Link} from '../../routes';

class RegistryIndex extends Component{
    static async getInitialProps(){
        const titles =  await registry.methods.getDeployedTitles().call();
        return {titles: titles};
    }

    renderTitles(){
        const items = this.props.titles.map(blockAddress=> {
            return{
                header:blockAddress,
                description: 
                    <Link route={`/titles/${blockAddress}`}>
                        <a>View Title</a>
                    </Link>,
                fluid: true
            }
        });
        console.log(items);
        return <Card.Group items={items}/>;
    
    }

    render(){
        return (
            <Layout>
            <div>
                
                <h1>All Titles Registered on Blockchain</h1>
                
                {/*<Button floated="right" content="Create Title" icon="add" primary={true}/>*/}
                {this.renderTitles()}

            </div>
            </Layout>
        )
    }
}

export default RegistryIndex;