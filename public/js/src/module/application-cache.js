/**
 * Deals with storing the app using service workers.
 */

import events from './event';
import settings from './settings';

function init( survey ) {

    if ( 'serviceWorker' in navigator ) {
        window.addEventListener( 'load', function() {
            navigator.serviceWorker.register( `${settings.basePath}/x/offline-app-worker.js` ).then( function( registration ) {
                // Registration was successful
                console.log( 'Offline application service worker registration successful with scope: ', registration.scope );
                setInterval( () => registration.update, 60 * 60 * 1000 ); // DEBUG set to 1 minute to test updates during session

                if ( registration.active ) {
                    _reportOfflineLaunchCapable( true );
                }
                registration.addEventListener( 'updatefound', () => {
                    const newWorker = registration.installing;

                    //console.log( 'new worker state', newWorker.state );
                    newWorker.addEventListener( 'statechange', () => {
                        //console.log( 'newWorker statechange event', newWorker.state, 'newWorker.active?', newWorker.active );
                        if ( newWorker.state === 'activated' ) {
                            console.log( 'New offline application service worker activated!' );
                            document.dispatchEvent( events.ApplicationUpdated() );
                        }
                    } );
                } );

            }, function( err ) {
                // registration failed :(
                console.error( 'Offline application service worker registration failed: ', err );
                _reportOfflineLaunchCapable( true );
            } );
        } );
    } else {
        console.error( 'Service workers not supported on this browser. This form cannot launch online' );
        _reportOfflineLaunchCapable( false );
    }
    return Promise.resolve( survey );

}

function _reportOfflineLaunchCapable( capable = true ) {
    document.dispatchEvent( events.OfflineLaunchCapable( { capable } ) );
}

export default {
    init,
    get serviceWorkerScriptUrl() {
        if ( 'serviceWorker' in navigator && navigator.serviceWorker.controller ) {
            return navigator.serviceWorker.controller.scriptURL;
        }
        return null;
    }
};
