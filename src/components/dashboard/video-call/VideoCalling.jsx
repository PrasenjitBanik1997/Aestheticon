import React, { useEffect, useRef, useState } from 'react';
import OT from '@opentok/client';
import './VideoCalling.css';


function VideoCalling(props) {

    const { credentialData } = props;

    const sessionRef = useRef(null);
    const publisherRef = useRef(null);

    useEffect(() => {
        const session = OT.initSession(credentialData.apikey, credentialData.sessionId);
        session.connect(credentialData.token, (error) => {
            if (error) {
                console.error('Failed to connect', error);
            } else {
                // Create publisher
                const publisher = OT.initPublisher('publisher-element');
                session.publish(publisher);
                publisherRef.current = publisher;
            }
        });
        session.on('streamCreated', function (event) {
            session.subscribe(event.stream, 'subscriber'
            );
        });
        sessionRef.current = session;
        return () => {
            // Disconnect and clean up session
            if (sessionRef.current) {
                sessionRef.current.disconnect();
                sessionRef.current = null;
            }
            // Clean up publisher
            if (publisherRef.current) {
                publisherRef.current.destroy();
                publisherRef.current = null;
            }
        };
    }, [credentialData]);

    return (
        <div className="pb-5 video-content">
            <div id="subscriber"></div>
            <div className='screen'>
                <div id="publisher-element"></div>
            </div>
        </div>
    );
}

export default VideoCalling;