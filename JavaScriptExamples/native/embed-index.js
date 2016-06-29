(function( global ){

  /*********************************************************************************************************************************************
   * get  = ajax( '/url', function( code, responseText ) {...} )                                                                               *
   * post = ajax( { url: '/url', method: 'POST', body: JSON.stringify({ param: param }), function( code, responseText, requestObject ) { ... } * 
   *********************************************************************************************************************************************/

  var ajax = function ( params, callback ) {
    if ( typeof params == 'string' ) { params = { url: params }; }
    var headers = params.headers || {}, body = params.body, method = params.method || ( body ? 'POST' : 'GET' ), withCredentials = params.withCredentials || false;
    var getRequest = function() { if ( global.XMLHttpRequest ) { return new global.XMLHttpRequest(); } else { try { return new global.ActiveXObject( "MSXML2.XMLHTTP.3.0" ); } catch( e ) {} } throw new Error( 'no xmlhttp request able to be created' ); };
    var setDefault = function( obj, key, value ) { obj[key] = obj[key] || value; };
    var req = getRequest();
    req.onreadystatechange = function () { if ( req.readyState == 4 ) { callback( req.status, req.responseText, req ); } };
    if (body) { setDefault( headers, 'X-Requested-With', 'XMLHttpRequest' ); setDefault( headers, 'Content-Type', 'application/json;charset=UTF-8' ); }
    req.open( method, params.url, true );
    req.withCredentials = withCredentials;
    for ( var field in headers ) { req.setRequestHeader( field, headers[field] ); }
    req.send( body );
  };


  var nameToken, hashToken;

  if (typeof window.name !== 'undefined') {
    nameToken = window.name;
  }

  if ( window.location.hash.length > 0 ) {
    hashToken = window.location.hash.replace( /#/, "" );
  }

  console.dir( { nameToken: nameToken, hashToken: hashToken } );

  var container = document.getElementsByClassName('container');

  container = container[0];

  var getter = function() { ajax( { url: window.location.pathname + '/content', method: 'POST', body: JSON.stringify( { hashToken: hashToken } ) }, function( code, responseText, request ) { var resObj = JSON.parse( responseText ); container.innerHTML = resObj.html; Tooltip.init(); } ); };

  var interval = global.setInterval( getter, 5000 );
  getter();
})( this );
