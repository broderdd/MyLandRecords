import React from 'react';
import {Container} from 'semantic-ui-react';
import Head from 'next/head';
import HeaderMenu from './Menu';

export default(props) => {
    return (
        <Container>
            <Head>
                <link 
                    rel="stylesheet" 
                    href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" 
                />
            </Head>
            
            <HeaderMenu/>

            <Container style={{ marginTop: '8em' }}>
                {props.children}
            </Container>

        </Container>
    );
};