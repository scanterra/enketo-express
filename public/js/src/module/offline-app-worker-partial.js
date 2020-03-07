/**  
 * The version, resources and fallback variables above are dynamically prepended by the offline-controller.
 */

const channel = new BroadcastChannel( 'enketo-sw-messages' );


self.addEventListener( 'install', event => {
    // Perform install steps
    event.waitUntil(
        caches.open( `enketo-common_${version}` )
        .then( cache => {
            console.log( 'Opened cache' );
            return cache.addAll( resources.concat( fallback ) );
        } )
        .catch( e => {
            console.log( 'Service worker install error', e );
        } )
        .catch( e => {
            console.error( 'Error posting service worker install message to client', e );
        } )
    );
} );

self.addEventListener( 'fetch', event => {
    event.respondWith(
        caches.match( event.request )
        .then( response => {
            if ( response ) {
                console.log( 'returning cached response for', event.request );
                channel.postMessage( { offlineLaunchCapable: true } );
                return response;
            }
            return fetch( event.request, { credentials: 'include' } )
                .then( response => {
                    if ( event.request.url.startsWith( '/x/' ) ) {
                        console.error( 'Resource missing from cache?', event.request.url );
                    }
                    // Check if we received a valid response
                    return response;
                } )
                .catch( () => {
                    // Let fail silently
                    console.log( 'Failed to fetch resource', event.request.url );
                } );
        } )
    );
} );
