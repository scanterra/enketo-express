/**
 * Deals with storing the app using service workers.
 */

//import events from './event';

function init( survey ) {
    console.log( ' loading service worker' );
    if ( 'serviceWorker' in navigator ) {
        window.addEventListener( 'load', function() {
            navigator.serviceWorker.register( '/x/offline-app-worker.js' ).then( function( registration ) {
                // Registration was successful
                console.log( 'ServiceWorker registration successful with scope: ', registration.scope );
            }, function( err ) {
                // registration failed :(
                console.log( 'ServiceWorker registration failed: ', err );
            } );
        } );
    } else {
        console.error( 'Service workers not supported on this browser. This form cannot launch online' );
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

function _reportOfflineLaunchCapable( event ) {
    //console.log( 'Application cache event:', event );
    //$( document ).trigger( 'offlinelaunchcapable' );
    //document.dispatchEvent( events.OfflineLaunchCapable( true ) );
}

function _reportOfflineLaunchIncapable( event ) {
    //console.log( 'Application cache event:', event );
    //$( document ).trigger( 'offlinelaunchincapable' );
    // document.dispatchEvent( events.OfflineLaunchCapable( true ) );
}

export default {
    init
};
