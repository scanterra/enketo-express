/**
 * Deals with storing the app using service workers.
 */

import events from './event';
import settings from './settings';

function init( survey ) {
    console.log( ' loading service worker' );
    if ( 'serviceWorker' in navigator ) {
        window.addEventListener( 'load', function() {
            navigator.serviceWorker.register( `${settings.basePath}/x/offline-app-worker.js` ).then( function( registration ) {
                // Registration was successful
                console.log( 'Offline application service worker registration successful with scope: ', registration.scope );
                setInterval( () => registration.update, 60 * 60 * 1000 ); // DEBUG set to 1 minute to test updates during session

                if ( registration.active ) {
                    _reportOfflineLaunchCapable();
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
                _reportOfflineLaunchIncapable();
            } );
        } );
    } else {
        console.error( 'Service workers not supported on this browser. This form cannot launch online' );
        _reportOfflineLaunchIncapable();
    }
    return Promise.resolve( survey );

    /*
    if ( window.applicationCache ) {
        const status = window.applicationCache.status;

        if ( status === window.applicationCache.IDLE ) {
            _reportOfflineLaunchCapable();
        } else if ( status === window.applicationCache.UPDATEREADY ) {
            _reportOfflineLaunchCapable();
            _swapCache();
        }

        $( window.applicationCache )
            .on( 'cached noupdate updateready', _reportOfflineLaunchCapable )
            .on( 'updateready', _swapCache )
            .on( 'obsolete', _reportOfflineLaunchIncapable );

    } else {
        console.error( 'applicationCache not supported on this browser, this form cannot launch online' );
    }*/
}

function _swapCache() {
    /*
    console.log( 'Swapping application cache' );
    // firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=769171
    try {
        window.applicationCache.swapCache();
        $( document ).trigger( 'applicationupdated' );
    } catch ( e ) {
        console.error( 'Error swapping cache', e );
    }*/
    // TODO: swap cache
    // document.dispatchEvent( events.ApplicationUpdated() );
}

function _reportOfflineLaunchCapable() {
    //console.log( 'Application cache event:', event );
    //$( document ).trigger( 'offlinelaunchcapable' );
    document.dispatchEvent( events.OfflineLaunchCapable( { capable: true } ) );
}

function _reportOfflineLaunchIncapable() {
    //console.log( 'Application cache event:', event );
    //$( document ).trigger( 'offlinelaunchincapable' );
    document.dispatchEvent( events.OfflineLaunchCapable( { capable: false } ) );
}

export default {
    init
};
