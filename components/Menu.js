import React, { Component } from 'react';
import {Container, Menu, Button, Image, Header} from 'semantic-ui-react';
import {Link} from '../routes';
import registry from '../ethereum/registry';
import web3 from '../ethereum/web3';


class HeaderMenu extends Component {
    constructor(props){
        super(props);
        this.state={
            adminAddress: '0',
            currentAddress: '1'
        };
    }
  
     async componentDidMount(){
        try{
            const details = await registry.methods.getAdmin().call();
            this.setState({
                adminAddress: '0x' + details,
                currentAddress: window.web3.currentProvider.selectedAddress
             })
        }catch(err){
            console.log("error in retrieving admin/current address")
        }
    }
    
    render(){
        const {adminAddress, currentAddress} = this.state;

        return (
            <Menu fixed='top' inverted>
                <Container>
                    <Menu.Item header>
                    <Image size='mini' src="https://cdn.imgbin.com/0/10/15/imgbin-computer-icons-house-logo-home-localisation-hxNFtKFekUwFKjchmnBebwUM4.jpg" style={{ marginRight: '1.5em' }} />
                        MY LAND RECORDS
                    </Menu.Item>
                    <Link route="/">
                        <a className="item">
                             Home
                        </a>
                
                    </Link>
                    <Link route="/titles">
                        <a className="item">
                            All Titles
                        </a>
                    </Link>
                    <Link route='/titles/pending'>
                        <a className="item">
                            Pending Titles
                        </a>
                    </Link>
                    {currentAddress!=adminAddress ? null : (
                        <Menu.Menu position='right'>
                            <Link route='/titles/new'>
                                <a className ='item'>
                                    <Button primary>Create New Title</Button>
                                </a>
                            </Link>
                        </Menu.Menu>
                    )}
                </Container>
            </Menu>
        )
    }
}

export default HeaderMenu;